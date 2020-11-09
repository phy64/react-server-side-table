import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { defaultProps, propTypes } from './propTypes';
import Table from './table';
import Pagination from './pagination';
import LoadingImg from './loading.png';
import './style.css';

class ReactServerSideTable extends Component {
  constructor(props) {
    super(props);

    const { 
      settings,
      addQueryParameters, 
      perPage, 
      currentPage, 
      order
    } = props;

    this.state = {
      settings: _.merge(_.cloneDeep(defaultProps.settings), settings),
      queryParameters: {
        search: '',
        addQueryParameters,
        limit: perPage,
        page: currentPage,
        orderBy: order.column,
        direction: order.direction,
      },
      data: [],
      total: 0,
      perPage,
      currentPage,
      order,
      from: 0,
      to: 0,
      checkAll: false,
      checkboxChecked: [],
      radioChecked: '',
      isLoading: true
    };

    this.onChangeDebounced = _.debounce(this.onChangeDebounced, 400);
  };

  async fetchData() {
    const { 
      url, 
      searching, 
      paging, 
      ordering 
    } = this.props;
    const { 
      settings: { dataSrc, queryParameterNames },
      queryParameters: { search, addQueryParameters, limit, page, orderBy, direction }
    } = this.state;
    
    const params = {
      [queryParameterNames.search]: searching ? search : null,
      [queryParameterNames.limit]: paging ? limit : null,
      [queryParameterNames.page]: paging ? page : null,
      [queryParameterNames.orderBy]: ordering ? orderBy : null,
      [queryParameterNames.direction]: ordering ? direction : null 
    };

    for (let query in addQueryParameters) {
      params[query] = addQueryParameters[query];
    };

    try {
      const response = await axios.get(url, { params });
      const { [dataSrc.data]: data, [dataSrc.total]: total } = response.data;

      if (data === undefined) {
        throw new Error(`'data' is invalid. Check in response or 'settings.dataSrc.data'.`);
      } else if (!Array.isArray(data)) {
        throw new Error(`'data' is invalid. must be array.`);
      } else if (total === undefined) {
        throw new Error(`'total' is invalid. Check in response or 'settings.dataSrc.total'.`);
      } else if (typeof total !== 'number') {
        throw new Error(`'total' is invalid. must be numeric.`);
      };

      const newState = {
        data,
        total,
        perPage: limit,
        currentPage: page,
        order: {column: orderBy, direction: direction},
        from: (page - 1) * limit + 1,
        to: Math.min(page * limit, total),
        checkAll: false,
        checkboxChecked: [],
        radioChecked: '',
        isLoading: false
      };

      this.setState(newState);
    } catch (e) {
      console.error(e);
      this.setState({
        isLoading: false
      });
    };
  };

  onChangeDebounced(parameters) {
    this.handleFetchData(parameters);
  };

  handleCheckboxRadioCallback(checkboxValues, radioValue) {
    const { checkboxCheckedCallback, radioCheckedCallback } = this.props;

    if (checkboxValues !== null && checkboxCheckedCallback !== null && typeof checkboxCheckedCallback === 'function') {
      checkboxCheckedCallback(checkboxValues);
    };

    if (radioValue !== null && radioCheckedCallback !== null && typeof radioCheckedCallback === 'function') {
      radioCheckedCallback(radioValue);
    };
  };

  handleFetchData(parameters) {
    this.setState(prevState => {
      const queryParameters = {
        ...prevState.queryParameters,
        ...parameters
      };

      this.handleCheckboxRadioCallback([], '');
    
      return { queryParameters, isLoading: true };
    }, () => {
      this.fetchData();
    });
  };

  handleSortColumn = (column) => {
    const { 
      settings: { orderDirectionNames: { ascending, descending } },
      queryParameters: { orderBy, direction }
    } = this.state;

    const parameters = {
      direction: ((orderBy !== column) || (direction === '')) ? ascending : direction === descending ? '' : descending,
      orderBy: direction === descending ? '' : column
    };

    this.handleFetchData(parameters);
  };

  handlePerPageChange = (event) => {
    const { value } = event.target;
    const { from } = this.state;

    const parameters = {
      limit: Number(value),
      page: Math.ceil(from / value)
    };

    this.handleFetchData(parameters);
  };

  handlePageChange = (page) => {
    const parameters = {
      page
    };

    this.handleFetchData(parameters);
  };

  handleFilter = (event) => {
    const { value } = event.target;
    const parameters = {
      page: 1,
      search: value
    };

    this.onChangeDebounced(parameters);
  };

  handleCheckboxAll = (event) => {
    const { value, checked } = event.target;
    const { data } = this.state;

    if (data.length) {
      const checkboxChecked = [];

      if (checked) {
        for (const d of data) {
          checkboxChecked.push(d[value]);
        };
      };

      this.handleCheckboxRadioCallback(checkboxChecked, null);
      
      this.setState({
        checkboxChecked,
        checkAll: checked
      });
    };
  };

  handleCheckbox = (event, value) => {
    const { checked } = event.target;
    const prevStateCheckboxChecked = [...this.state.checkboxChecked];
    const checkboxChecked = checked ? [...prevStateCheckboxChecked, value] : prevStateCheckboxChecked.filter(item => item !== value);
    
    this.handleCheckboxRadioCallback(checkboxChecked, null);

    this.setState(prevState => ({
      checkboxChecked,
      checkAll: prevState.data.length === checkboxChecked.length
    }));
  };

  handleRadio = (value) => {
    this.handleCheckboxRadioCallback(null, value);

    this.setState({
      radioChecked: value
    });
  };

  componentDidMount() {
    this.fetchData();
  };

  shouldComponentUpdate(nextProps, nextState){
    return (nextState !== this.state) || !this.state.isLoading;
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.reRenderApiRequest && 
      (prevState.isLoading === this.state.isLoading) && 
      (prevState.checkboxChecked === this.state.checkboxChecked) && 
      (prevState.radioChecked === this.state.radioChecked)
    ) {
      const { currentPage, perPage, order, addQueryParameters } = this.props;
      const parameters = { ...prevState.queryParameters };
      
      if (prevProps.currentPage !== currentPage) {
        parameters.page = currentPage;
      };

      if (prevProps.perPage !== perPage) {
        parameters.limit = Number(perPage);
      };
      
      if (!_.isEqual(prevProps.addQueryParameters , addQueryParameters)) {
        parameters.page = 1;
        parameters.addQueryParameters = addQueryParameters;
      };

      if (!_.isEqual(prevProps.order , order)) {
        parameters.orderBy = order.column;
        parameters.direction = order.direction;
      };

      this.handleFetchData(parameters);
    };
  };    

  render() {
    const { 
      headers, 
      columns, 
      ordering, 
      lengthChange, 
      searching, 
      pageInfo, 
      paging,
      children
    } = this.props;
    const { 
      data,
      total, 
      currentPage,
      perPage,
      order : { column, direction },
      from, 
      to,
      checkAll,
      checkboxChecked,
      radioChecked,
      isLoading,
      settings: {
        defaultStyle,
        wrapperClass,
        tableClass,
        loadingImage,
        colGroup,
        orderDirectionNames: { ascending },
        perPageValues,
        language,
        pagingDisplayLength,
        pagingFirstLastBtn,
        pagingPrevNextBtn,
      }
    } = this.state;

    return (
      <div className={`${defaultStyle ? 'react-server-side-table ' : ''}${wrapperClass}`}>
        {
          isLoading && (
            <div className="loading">
              {
                loadingImage ? (
                  loadingImage
                ) : (
                  <img src={ LoadingImg } alt=' '/>
                )
              }
            </div>
          )
        }
        {
          (lengthChange || searching || (children !== null && children !== undefined)) && (
            <div className="table-toolbar">
              {
                (lengthChange && paging) && (
                  <div className="length-menu">
                    <span>{language.lengthMenu.show}</span>
                    <select 
                      value={perPage} 
                      onChange={this.handlePerPageChange}
                    >
                      {
                        perPageValues.map(value => (
                          <option key={value} value={value}>{value}</option>
                        ))
                      }
                    </select>
                    <span>{language.lengthMenu.entries}</span>
                  </div>
                )
              }
              {
                children !== undefined && ( 
                  children 
                )
              }
              {
                searching && (
                  <div className="search-input">
                    <input 
                      type="text" 
                      placeholder={language.search}
                      onChange={this.handleFilter}
                    />
                  </div>
                )
              }
            </div>
          )
        }
        <div className="table-container">
          <Table
            data={data}
            total={total}
            from={from}
            headers={headers}
            columns={columns}
            colGroup={colGroup}
            ordering={ordering}
            orderDirectionAsc={ascending}
            orderBy={column}
            direction={direction}
            checkAll={checkAll}
            checkboxChecked={checkboxChecked}
            radioChecked={radioChecked}
            defaultStyle={defaultStyle}
            tableClass={tableClass}
            empty={language.empty}
            handleSortColumn={this.handleSortColumn}
            handleCheckboxAll={this.handleCheckboxAll}
            handleCheckbox={this.handleCheckbox}
            handleRadio={this.handleRadio}
          />
        </div>
        <div className="table-pagination">
          {
            pageInfo && (
              <div className="page-info">
                {
                  (language.pageInfo.formatter !== null && typeof language.pageInfo.formatter === 'function') ? (
                    language.pageInfo.formatter({total, from, to})
                  ) : (
                    `${(paging && total > 0) ? `${language.pageInfo.showing} ${from} ${language.pageInfo.to} ${to} ${language.pageInfo.of} ` : ''}${total} ${language.pageInfo.entries}`
                  )
                }
              </div>
            )
          }
          {
            paging && (
              <Pagination
                total={total}
                perPage={perPage}
                currentPage={currentPage}
                pagingDisplayLength={pagingDisplayLength}
                pagingFirstLastBtn={pagingFirstLastBtn}
                pagingPrevNextBtn={pagingPrevNextBtn}
                language={language.pagination}
                handlePageChange={this.handlePageChange}
              />
            ) 
          }
        </div>
      </div>
    );
  };
};

ReactServerSideTable.defaultProps = defaultProps;
ReactServerSideTable.propTypes = propTypes;

export default ReactServerSideTable;