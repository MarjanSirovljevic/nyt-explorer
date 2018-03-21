import React from 'react';

export default class PageSelect extends React.Component {
  constructor(props) {
    super(props);
    this.handlePageSizeSelect = this.handlePageSizeSelect.bind(this);
  }
  handlePageSizeSelect(e) {
    const selectedPageSize = parseInt(e.target.value);
    this.props.handlePageSizeSelect(selectedPageSize);
  }
  render() {
    return (
      <div>
        Page Size: 
        <select className="page-size" value={this.props.pageSize} onChange={this.handlePageSizeSelect}>
          <option value="2">2</option>
          <option value="4">4</option>
          <option value="8">8</option>
          <option value="20">20</option>
          <option value="40">40</option>
        </select>
      </div>
    );
  }
}