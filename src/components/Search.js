import React from 'react';

let timeout = null;

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }
  handleSearchChange(e) {
    clearTimeout(timeout);
    const searchTerm = e.target.value;
    timeout = setTimeout(() => {
      this.props.handleSearchChange(searchTerm);
    } ,500);
  }
  render() {
    return (
      <input 
        type="text" 
        onKeyUp={this.handleSearchChange} 
        placeholder="Search the title"
      />
    );
  }
}