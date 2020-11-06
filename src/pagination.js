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

  let visiblePages = pagingDisplayLength;
  const totalPage = Math.ceil(total/perPage);

  if (visiblePages > totalPage) {
	  visiblePages = totalPage;
  };

  const half = Math.floor(visiblePages / 2);
  let start = currentPage - half + 1 - visiblePages % 2;
  let end = currentPage + half;

  if (start < 1) {
    start = 1;
    end = visiblePages;
  };

  if (end > totalPage) {
    start = 1 + totalPage - visiblePages;
    end = totalPage;
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
  
  for (let i = start; i < end + 1; i++) {
    pagination.push(
      <li key={i} className={currentPage === i ? 'active' : null}>
        <a href="# " onClick={(event) => pageChange(event, i)}>{i}</a>
      </li>
    );
  };

  if (pagingPrevNextBtn) {
    pagination.unshift(
      <li key="prev" className={`prev ${firstDisabledClass}`}>
        <a href="# " onClick={(event) => pageChange(event, currentPage - 1)}>{prev}</a>
      </li>
    );
    pagination.push(
      <li key="next" className={`next ${lastDisabledClass}`}>
        <a href="# " onClick={(event) => pageChange(event, currentPage + 1)}>{next}</a>
      </li>
    );
  };

  if (pagingFirstLastBtn) {
    pagination.unshift(
      <li key="first" className={`first ${firstDisabledClass}`}>
        <a href="# " onClick={(event) => pageChange(event, 1)}>{first}</a>
      </li>
    );
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