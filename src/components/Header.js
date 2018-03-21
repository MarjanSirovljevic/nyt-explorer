import React from 'react';
import FindArticles from './FindArticles';

const Header = (props) => (
  <header id="header">
    <h1><span></span></h1>
    <FindArticles
      yearMonth={props.yearMonth}
      handleYMChange={props.handleYMChange}
      handleYMSubmit={props.handleYMSubmit}
    />
  </header>
);

export default Header;