import PropTypes from 'prop-types';

const defaultProps = {
  headers: [],
  reRenderApiRequest: false,
  ordering: false,
  lengthChange: true,
  searching: true,
  pageInfo: true,
  paging: true,
  currentPage: 1,
  perPage: 10,
  order: {
    column: '', 
    direction: ''
  },
  addQueryParameters: {},
  checkboxCheckedCallback: null,
  radioCheckedCallback: null,
  settings: {
    defaultStyle: true,
    wrapperClass: '',
    tableClass: '',
    loadingImage: null,
    perPageValues: [10, 20, 30, 100],
    pagingDisplayLength: 10,
    pagingFirstLastBtn: true,
    pagingPrevNextBtn: true,
    colGroup: [],
    dataSrc: {
      data: "data",
      total: "total"
    },
    language: {
      lengthMenu: {
        show: 'Show',
        entries: 'entries'
      },
      pageInfo: {
        showing: 'Showing',
        to: 'to',
        of: 'of',
        entries: 'entries',
        formatter: null
      },
      pagination: {
        first: 'First',
        prev: 'Previous',
        next: 'Next',
        last: 'Last'
      },
      search: 'Search',
      empty : 'No entries to display'
    },
    queryParameterNames: {
      search: 'search',
      limit: 'limit',
      page: 'page',
      orderBy: 'orderBy',
      direction: 'direction',
    },
    orderDirectionNames: {
      ascending: 'asc',
      descending: 'desc',
    }
  }
};

const propTypes = {
  url: PropTypes.string.isRequired,
  headers: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.node.isRequired,
        checkboxAll: PropTypes.bool,
        sortable: PropTypes.bool,
        column: PropTypes.string,
        rowSpan: PropTypes.number,
        colSpan: PropTypes.number,
        className: PropTypes.string
      }).isRequired
    ).isRequired
  ).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      checkbox: PropTypes.bool,
      formatter: PropTypes.func,
      className: PropTypes.string
    }).isRequired
  ).isRequired,
  reRenderApiRequest: PropTypes.bool,
  ordering: PropTypes.bool,
  lengthChange: PropTypes.bool,
  searching: PropTypes.bool,
  pageInfo: PropTypes.bool,
  paging: PropTypes.bool,
  currentPage: PropTypes.number,
  perPage: PropTypes.number,
  order: PropTypes.shape({
    column: PropTypes.string.isRequired, 
    direction: PropTypes.string.isRequired,
  }),
  addQueryParameters: PropTypes.object,
  checkboxCheckedCallback: PropTypes.func,
  radioCheckedCallback: PropTypes.func,
  settings: PropTypes.shape({
    defaultStyle: PropTypes.bool,
    wrapperClass: PropTypes.string,
    tableClass: PropTypes.string,
    loadingImage: PropTypes.node,
    perPageValues: PropTypes.arrayOf(PropTypes.number.isRequired),
    pagingDisplayLength: PropTypes.number,
    pagingFirstLastBtn: PropTypes.bool,
    pagingPrevNextBtn: PropTypes.bool,
    colGroup: PropTypes.arrayOf(PropTypes.string),
    dataSrc: PropTypes.shape({
      data: PropTypes.string.isRequired, 
      total: PropTypes.string.isRequired
    }),
    language: PropTypes.shape({
      lengthMenu: PropTypes.objectOf(PropTypes.node),
      pageInfo: PropTypes.shape({
        showing: PropTypes.string,
        to: PropTypes.string,
        of: PropTypes.string,
        entries: PropTypes.string,
        formatter: PropTypes.func
      }),
      pagination: PropTypes.objectOf(PropTypes.node),
      search: PropTypes.string,
      empty : PropTypes.string
    }),
    queryParameterNames: PropTypes.objectOf(PropTypes.string),
    orderDirectionNames: PropTypes.objectOf(PropTypes.string),
  })
};

export { defaultProps, propTypes }