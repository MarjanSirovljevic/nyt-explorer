import React from 'react';

export default class FindArticles extends React.Component {
  constructor(props) {
    super(props);
    this.handleYMChange = this.handleYMChange.bind(this);
    this.handleYMSubmit = this.handleYMSubmit.bind(this);
  }
  handleYMChange(e) {
    const yearMonthStr = e.target.value;
    if( !!yearMonthStr) {
      this.props.handleYMChange(yearMonthStr);
    }
  }
  handleYMSubmit(e) {
    e.preventDefault();
    this.props.handleYMSubmit();
  }
  render() {
    // creating year-month string from the selectedYear array
    // actually month decreased by 1 because of potential problem when switching months in real time
    const selectedYear = this.props.yearMonth[0].toString();
    let selectedMonth = this.props.yearMonth[1].toString();
    selectedMonth = selectedMonth.length > 1 ? selectedMonth : `0${selectedMonth}`;
    const value = `${selectedYear}-${selectedMonth}`;

    // defining max value for input month field
    const currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth() + 1;
    currentMonth = currentMonth.length > 1 ? currentMonth : `0${currentMonth}`;
    const max = `${currentYear}-${currentMonth}`;

    return (
      <form className="header-form" onSubmit={this.handleYMSubmit}>
        <input type="month" value={value} min="1851-09" max={max} onChange={this.handleYMChange} />
        <input type="submit" value="Find" />
      </form>
    );
  }
}