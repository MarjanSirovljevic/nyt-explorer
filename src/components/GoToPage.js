import React from 'react';

export default class GoToPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleGoToPage = this.handleGoToPage.bind(this);
  }
  handleGoToPage(e) {
    let pageNumber = parseInt(e.target.value);
    if( isNaN(pageNumber) ) {
      return;
    }
    if(pageNumber > this.props.totalPages) {
      pageNumber = this.props.totalPages;
    }
    this.props.handleGoToPage(pageNumber);
  }
  render() {
    return (
      <div>
        Go to page: 
        <input
          type="number"
          min="1"
          max={this.props.totalPages}
          value={this.props.pageNumber}
          onChange={this.handleGoToPage}
          disabled={!this.props.totalPages} />
      </div>
    );
  }
}