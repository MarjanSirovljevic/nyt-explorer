import React from 'react';

export default class SortBy extends React.Component {
  constructor(props) {
    super(props);
    this.handleSortByChange = this.handleSortByChange.bind(this);
  }
  handleSortByChange(e) {
    const sortBy = e.target.value;
    this.props.handleSortByChange(sortBy);
  }
  render() {
    const sortBy = this.props.sortBy;
    const asc = this.props.isAsc ? 'asc' : 'desc';
    const currentValue = `${sortBy} ${asc}`;
    return (
      <select className="filter" value={currentValue} onChange={this.handleSortByChange}>
        <option value="date asc">Date &#129049;</option>
        <option value="date desc">Date &#129051;</option>
        <option value="title asc">Title &#129049;</option>
        <option value="title desc">Title &#129051;</option>
      </select>
    );
  }
}