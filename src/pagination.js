import React, { memo } from 'react';

const Pagination = (props) => {
  const { 
    total, 
    perPage,
    currentPage,
    pagingDisplayLength,
    pagingFirstLastBtn,
    pagingPrevNextBtn,
    language: { first, prev, next, last },
    handlePageChange
  } = props;

  const totalPage = Math.ceil(total/perPage);
  const pageGroup = Math.ceil(currentPage/pagingDisplayLength); 
  let pageLast = pageGroup * pagingDisplayLength;  
  const pageFirst = pageLast - (pagingDisplayLength - 1);

  if(pageLast > totalPage){
    pageLast = totalPage;
  };

  const pagination = [];
  const firstDisabledClass = (currentPage === 1 || total === 0) ? 'disabled' : '';
  const lastDisabledClass = (currentPage === totalPage || total === 0 || isNaN(totalPage)) ? 'disabled' : '';

  const pageChange = (event, value) => {
    event.preventDefault();

    if (value !== currentPage && value >= 1 && value <= totalPage) {
      handlePageChange(value);
    };
  };

  if (pagingFirstLastBtn) {
    pagination.push(
      <li key="first" className={`first ${firstDisabledClass}`}>
        <a href="# " onClick={(event) => pageChange(event, 1)}>{first}</a>
      </li>
    );
  };
  if (pagingPrevNextBtn) {
    pagination.push(
      <li key="prev" className={`prev ${firstDisabledClass}`}>
        <a href="# " onClick={(event) => pageChange(event, currentPage - 1)}>{prev}</a>
      </li>
    );
  };
  if (total > 0 && !isNaN(totalPage)) {
    for (let i = pageFirst; i < pageLast + 1; i++) {
      pagination.push(
        <li key={i} className={currentPage === i ? 'active' : null}>
          <a href="# " onClick={(event) => pageChange(event, i)}>{i}</a>
        </li>
      );
    }
  };
  if (pagingPrevNextBtn) {
    pagination.push(
      <li key="next" className={`next ${lastDisabledClass}`}>
        <a href="# " onClick={(event) => pageChange(event, currentPage + 1)}>{next}</a>
      </li>
    );
  };
  if (pagingFirstLastBtn) {
    pagination.push(
      <li key="last" className={`last ${lastDisabledClass}`}>
        <a href="# " onClick={(event) => pageChange(event, totalPage)}>{last}</a>
      </li>
    );
  };

  return (
    <ul className="pagination">
      { pagination }
    </ul>
  );
};

export default memo(Pagination);