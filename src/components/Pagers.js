import React from 'react';

const Pagers = (props) => (
  <button onClick={props.handleButtonClick} disabled={!props.clickable}>
    {props.buttonName}
  </button>
);

export default Pagers;