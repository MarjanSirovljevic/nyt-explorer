import React from 'react';
import $ from 'jquery';

import Articles from './Articles';
import ArticleDetails from './ArticleDetails';
import Footer from './Footer';
import Header from './Header';
import PageInfo from './PageInfo';
import PageNav from './PageNav';
import PageSelect from './PageSelect';
import Search from './Search';
import SortBy from './SortBy';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleYMChange = this.handleYMChange.bind(this);
    this.handleYMSubmit = this.handleYMSubmit.bind(this);
    this.handleArticleClick = this.handleArticleClick.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.handlePageSizeSelect = this.handlePageSizeSelect.bind(this);
    this.handleSortByChange = this.handleSortByChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handlePrevButtonClick = this.handlePrevButtonClick.bind(this);
    this.handleNextButtonClick = this.handleNextButtonClick.bind(this);
    this.handleGoToPage = this.handleGoToPage.bind(this);
    const currentDate = new Date();
    this.state = {
      yearMonth: [currentDate.getFullYear(), currentDate.getMonth()],
      fetchedArticles: [],
      pageNumber: 1,
      pageSize: 4,
      sortBy: 'date',
      asc: true,
      searchTerm: '',
      selectedArticle: {}
    };
  }
  handleYMChange(yearMonthStr) {
    const yearMonth = yearMonthStr.split('-');
    this.setState(() => ({ yearMonth }));
  }
  handleYMSubmit() {
    const year = this.state.yearMonth[0];
    const month = parseInt(this.state.yearMonth[1]);
    const apiKey = '464473d275d24772b7c7c998b5faaa0b';
    const url = `https://developer.nytimes.com/proxy/https/api.nytimes.com/svc/archive/v1/${year}/${month}.json?api-key=${apiKey}`;
    $.ajax({
      url,
      success: this.onSuccess,
      error: this.onError
    });
  }
  onSuccess(data) {
    const fetchedArticles = data.response.docs;
    this.setState(() => ({ fetchedArticles, pageNumber: 1, selectedArticle: {} }));
  }
  onError(error) {
    throw error;
  }
  handleArticleClick(selectedArticle) {
    this.setState(() => ({ selectedArticle }));
  }
  handlePageSizeSelect(pageSize) {
    this.setState(() => ({ pageSize, pageNumber: 1, selectedArticle: {} }));
  }
  handleSortByChange(sortValue) {
    const sortValueArray = sortValue.split(' ');
    const sortBy = sortValue.split(' ')[0];
    const asc = sortValue.split(' ')[1] === 'asc' ? true : false ;
    this.setState(() => ({ sortBy, asc, pageNumber: 1, selectedArticle: {} }));
  }
  handleSearchChange(searchTerm) {
    this.setState(() => ({ searchTerm, pageNumber: 1, selectedArticle: {} })); 
  }
  handlePrevButtonClick() {
    this.setState((prevState) => ({ pageNumber: prevState.pageNumber - 1, selectedArticle: {} }));
  }
  handleNextButtonClick() {
    this.setState((prevState) => ({ pageNumber: prevState.pageNumber + 1, selectedArticle: {} }));
  }
  handleGoToPage(pageNumber) {
    this.setState(() => ({ pageNumber, selectedArticle: {} }));
  }
  componentDidMount() {
    this.handleYMSubmit();
  }
  dateToTimeStamp(dateString) {
    const timeStamp = new Date(dateString).getTime();
    return timeStamp;
  }
  sortArticles(rawArticles, sortBy, asc) {
    if(asc && sortBy === 'date') {
      const articles = rawArticles.sort((a,b) => {
        return this.dateToTimeStamp(a.pub_date) - this.dateToTimeStamp(b.pub_date);
      });
      return articles;
    }
    if(!asc && sortBy === 'date') {
      const articles = rawArticles.sort((a,b) => {
        return this.dateToTimeStamp(b.pub_date) - this.dateToTimeStamp(a.pub_date);
      });
      return articles;
    }
    if(asc && sortBy === 'title') {
      const articles = rawArticles.sort((a,b) => {
        const title_a = a.headline.main.toUpperCase();
        const title_b = b.headline.main.toUpperCase();
        if(title_a < title_b) {
          return -1;
        }
        if(title_a > title_b) {
          return 1;
        }
        return 0;
      });
      return articles;
    }
    if(!asc && sortBy === 'title') {
      const articles = rawArticles.sort((a,b) => {
        const title_a = a.headline.main.toUpperCase();
        const title_b = b.headline.main.toUpperCase();
        if(title_a > title_b) {
          return -1;
        }
        if(title_a < title_b) {
          return 1;
        }
        return 0;
      });
      return articles;
    }
  }
  render() {
    const start = (this.state.pageNumber - 1) * this.state.pageSize;
    const end = start + this.state.pageSize;
    const articles = this.sortArticles(this.state.fetchedArticles, this.state.sortBy, this.state.asc).filter((article) => {
      return article.headline.main.toUpperCase().indexOf(this.state.searchTerm.toUpperCase()) !== -1;
    });
    const totalPages = Math.ceil(articles.length / this.state.pageSize);
    const articlesToShow = articles.slice(start, end);
    const jsxAjax = (
      <div id="page">
        <Header
          yearMonth={this.state.yearMonth}
          handleYMChange={this.handleYMChange}
          handleYMSubmit={this.handleYMSubmit}
        />
        <main id="main">
          <section id="top">
            <div className="top-cell">
              <Search handleSearchChange={this.handleSearchChange} />
              <SortBy
                sortBy={this.state.sortBy}
                isAsc={this.state.asc}
                handleSortByChange={this.handleSortByChange}
              />
            </div>
            <div className="top-cell">
              <PageSelect
                pageSize={this.state.pageSize}
                handlePageSizeSelect={this.handlePageSizeSelect}
              />
              <PageInfo
                pageSize={this.state.pageSize}
                displayedElements={articlesToShow.length}
                pageNumber={this.state.pageNumber}
                totalArticles={articles.length}
              />
            </div>
          </section>
          <section id="center">
            <Articles
              selectedArticle={this.state.selectedArticle}
              articlesToShow={articlesToShow}
              handleArticleClick={this.handleArticleClick}
            />
            <ArticleDetails selectedArticle={this.state.selectedArticle} />
          </section>
          <section id="bottom">
            <div className="bottom-cell">
              <PageSelect
                pageSize={this.state.pageSize}
                handlePageSizeSelect={this.handlePageSizeSelect}
              />
              <PageInfo
                pageSize={this.state.pageSize}
                displayedElements={articlesToShow.length}
                pageNumber={this.state.pageNumber}
                totalArticles={articles.length}
              />
            </div>
            <PageNav
              pageNumber={this.state.pageNumber}
              totalPages={totalPages}
              handlePrevButtonClick={this.handlePrevButtonClick}
              handleNextButtonClick={this.handleNextButtonClick}
              handleGoToPage={this.handleGoToPage}
              totalArticles={articles.length}
            />
          </section>       
        </main>
        <Footer />
      </div>
    );
    const jsxProgress = (
      <div id="page">
        <div id="progress">
          <img src="./loader.gif" />
        </div>
      </div>
    );

    return this.state.fetchedArticles.length > 0 ? jsxAjax : jsxProgress;
  }
}
