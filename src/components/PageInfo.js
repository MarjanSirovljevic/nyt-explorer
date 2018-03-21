import React from 'react';

const PageInfo = (props) => {
  const start = (props.pageNumber - 1) * props.pageSize + 1;
  const end = start + props.displayedElements - 1;
  return (
    <div>Showing <span> {start} - {end} </span> of <span> {props.totalArticles} </span>Articles</div>
  );  
};

export default PageInfo;