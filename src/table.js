import React from 'react';

const Table = (props) => {
  const { 
    data,
    total,
    from,
    headers,
    columns,
    colGroup,
    ordering,
    orderDirectionAsc,
    orderBy,
    direction,
    checkAll,
    checkboxChecked,
    radioChecked,
    defaultStyle,
    tableClass,
    empty,
    handleSortColumn,
    handleCheckboxAll,
    handleCheckbox,
    handleRadio,
  } = props;
  
  return (
    <table className={tableClass}>
      {
        colGroup.length > 0 && (
          <colgroup>
            {
              colGroup.map((col, index) => (
                <col key={index + col} width={col}/>
              ))
            }
          </colgroup>
        )
      }
      {
        headers.length > 0 && (
          <thead>
            {
              headers.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {
                    row.map((item, index) => {
                      const { column, title, checkboxAll, sortable, colSpan, rowSpan, className } = item;
                      const classNames = [];
                      const isColumn = column === undefined || column === '' || typeof column !== 'string';
                      let sortIcon = null;

                      if(checkboxAll && isColumn){
                        throw new Error(`The 'column' attribute is required when the props 'headers: [[{ ..., checkboxAll: true}]]'`);
                      }

                      if(ordering && sortable){
                        if(isColumn){
                          throw new Error(`The 'column' attribute is required when the props 'ordering' is true and 'headers: [[{ ..., sortable: true}]]'`);
                        }

                        classNames.push('sort-th');
                        sortIcon = <span className={`sort-icon ${orderBy !== column ? 'sort-both' : direction === orderDirectionAsc ? 'sort-asc' : 'sort-desc'}`}/>
                      }

                      if(className){
                        classNames.push(className);
                      }

                      return (
                        <th key={index}
                          className={classNames.length > 0 ? classNames.join(' ') : undefined}
                          onClick={(ordering && sortable) ? () => handleSortColumn(column) : undefined}
                          rowSpan={rowSpan}
                          colSpan={colSpan}
                        >
                          { 
                            checkboxAll ? (
                              <label className="table-checkbox bounce">
                                <input
                                  type="checkbox"
                                  checked={checkAll}
                                  value={column}
                                  onChange={handleCheckboxAll}
                                />
                                {
                                  defaultStyle ? (
                                    <svg viewBox="0 0 21 21">
                                      <polyline points="5 10.75 8.5 14.25 16 6"></polyline>
                                    </svg>
                                  ) : (
                                    <span></span>
                                  )
                                }
                              </label>
                            ) : (
                              title
                            )
                          }
                          { sortIcon }
                        </th>
                      )
                    })
                  }
                </tr>
              ))
            }
          </thead>
        )
      }
      <tbody>
        {
          data.length > 0 ? (
            data.map((row, rowIndex) => {
              return (
                <tr key={rowIndex}>
                  {
                    columns.map((item, index) => {
                      const { name, checkbox, radio, formatter, className } = item;
                      
                      return (
                        <td key={name + index} className={className}>
                          {
                            (checkbox || radio) ? (
                              checkbox ? (
                                <label className="table-checkbox path">
                                  <input
                                    type="checkbox"
                                    name={name}
                                    checked={checkboxChecked.includes(row[name])}
                                    onChange={(event) => handleCheckbox(event, row[name])}
                                  />
                                  {
                                    defaultStyle ? (
                                      <svg viewBox="0 0 21 21">
                                        <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
                                      </svg>
                                    ) : (
                                      <span></span>
                                    )
                                  }
                                </label>
                              ) : (
                                <label className="table-radio">
                                  <input
                                    type="radio"
                                    name={name}
                                    checked={radioChecked === row[name]}
                                    onChange={() => handleRadio(row[name])}
                                  />
                                  {
                                    defaultStyle ? (
                                      <svg viewBox="0 0 20 20">
                                        <path d="M10,7 C8.34314575,7 7,8.34314575 7,10 C7,11.6568542 8.34314575,13 10,13 C11.6568542,13 13,11.6568542 13,10 C13,8.34314575 11.6568542,7 10,7 Z" className="inner"></path>
                                        <path d="M10,1 L10,1 L10,1 C14.9705627,1 19,5.02943725 19,10 L19,10 L19,10 C19,14.9705627 14.9705627,19 10,19 L10,19 L10,19 C5.02943725,19 1,14.9705627 1,10 L1,10 L1,10 C1,5.02943725 5.02943725,1 10,1 L10,1 Z" className="outer"></path>
                                      </svg>
                                    ) : (
                                      <span></span>
                                    )
                                  }
                                </label>
                              )
                            ) : (
                              formatter !== undefined ? (
                                formatter({
                                  rowData: row,
                                  dataIndex: rowIndex,
                                  total,
                                  from,
                                })
                              ) : (
                                row[name]
                              )
                            )
                          }
                        </td>
                      )
                    })
                  }
                </tr>
              )
            })
          ) : (
            <tr className="text-center">
              <td colSpan={columns.length}>{ empty }</td>
            </tr>
          )
        }
      </tbody>
    </table>
  );
}

export default Table;