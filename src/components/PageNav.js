import React from 'react';

import GoToPage from './GoToPage';
import Pagers from './Pagers';

const PageNav = (props) => (
  <div className="bottom-cell">
    <div>
      <Pagers
        buttonName="&#129060;"
        handleButtonClick={props.handlePrevButtonClick}
        clickable={props.pageNumber > 1}
      />
      <Pagers
        buttonName="&#129062;"
        handleButtonClick={props.handleNextButtonClick}
        clickable={props.pageNumber < props.totalPages}
      />
    </div>
    <GoToPage
      handleGoToPage={props.handleGoToPage}
      totalPages={props.totalPages}
      pageNumber={props.pageNumber}
    />
  </div>
);

export default PageNav;