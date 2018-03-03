let timeout = null;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleYMChange = this.handleYMChange.bind(this);
    this.handleYMSubmit = this.handleYMSubmit.bind(this);
    this.handleArticleClick = this.handleArticleClick.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.handlePageSizeSelect = this.handlePageSizeSelect.bind(this);
    this.handleSortByChange = this.handleSortByChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
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
    this.setState(() => ({ fetchedArticles }));
  }
  onError(error) {
    throw error;
  }
  handleArticleClick(selectedArticle) {
    this.setState(() => ({ selectedArticle }));
  }
  handlePageSizeSelect(pageSize) {
    this.setState(() => ({ pageSize, pageNumber: 1 }));
  }
  handleSortByChange(sortValue) {
    const sortValueArray = sortValue.split(' ');
    const sortBy = sortValue.split(' ')[0];
    const asc = sortValue.split(' ')[1] === 'asc' ? true : false ;
    this.setState(() => ({ sortBy, asc }));
  }
  handleSearchChange(searchTerm) {
    this.setState(() => ({ searchTerm })); 
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
            <SortBy
              sortBy={this.state.sortBy}
              isAsc={this.state.asc}
              handleSortByChange={this.handleSortByChange}
            />
            <Search handleSearchChange={this.handleSearchChange} />
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
          </section>
          <section id="center">
            <Articles
              selectedArticle={this.state.selectedArticle}
              articlesToShow={articlesToShow}
              handleArticleClick={this.handleArticleClick}
            />
            <ArticleDetails selectedArticle={this.state.selectedArticle} />
          </section>
          <section id="bottom">BOTTOM</section>        
        </main>
        <Footer />
      </div>
    );
    const jsxProgress = (
      <div id="page">
        <div id="progress">
          <img src="./images/loader.gif" />
        </div>
      </div>
    );

    articlesToShow.forEach((article) => { console.log(article.pub_date); }); 
    console.log('===========================================================');

    return this.state.fetchedArticles.length > 0 ? jsxAjax : jsxProgress;
  }
}

class Header extends React.Component {
  render() {
    return (
      <header id="header">
        <h1><span></span></h1>
        <FindArticles
          yearMonth={this.props.yearMonth}
          handleYMChange={this.props.handleYMChange}
          handleYMSubmit={this.props.handleYMSubmit}
        />
      </header>
    );
  }
}

class FindArticles extends React.Component {
  constructor(props) {
    super(props);
    this.handleYMChange = this.handleYMChange.bind(this);
    this.handleYMSubmit = this.handleYMSubmit.bind(this);
  }
  handleYMChange(e) {
    const yearMonthStr = e.target.value;
    console.log(!!yearMonthStr);
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
};

class Articles extends React.Component {
  render() {
    return (
      <aside id="gallery" className="gutters">
       { 
          this.props.articlesToShow.map((article) => {
            const visible = !!Object.keys(this.props.selectedArticle).length && this.props.selectedArticle._id === article._id;
            return (
              <Article
                key={article._id}
                visible={visible}
                handleArticleClick={this.props.handleArticleClick}
                article={article}
                url={article.web_url}
                date={article.pub_date}
              />
            );
        })
        }
    </aside>
    );
  }
}

class Article extends React.Component {
  constructor(props) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.onSuccessGoogle = this.onSuccessGoogle.bind(this);
    this.handleArticleClick = this.handleArticleClick.bind(this);
    this.state = {
      linkPreview: {}
    };
  }
  componentDidMount() {
    const apiKey = '5a8d5223dca2776423c4f56557c4307b284e358df5652';
    const url = `https://api.linkpreview.net/?key=${apiKey}&q=${this.props.url}`;
    $.ajax({
      url,
      success: this.onSuccess,
      error: this.onError
    });
  }
  onSuccess(data) {
    const linkPreview = data;
    this.setState(() => ({ linkPreview }));
  }
  onSuccessGoogle(data) {
    const linkPreview = data;
    this.setState(() => ({ linkPreview }));
  } 
  onError() {
    const url = 'https://api.linkpreview.net/?key=123456&q=https://www.google.com';
    $.ajax({
      url,
      success: this.onSuccessGoogle,
      error: this.onErrorGoogle
    });
  }
  onErrorGoogle(error) {
    throw error;
  }
  handleArticleClick() {
    const selectedArticle = this.props.article;
    this.props.handleArticleClick(selectedArticle);
  }
  render() {
    const article = this.props.article;
    return (
      <div className="article">
        <div className="article-wrapper">
          <div className="article-display" onClick={this.handleArticleClick}>
            <img src={this.state.linkPreview.image} alt={this.state.linkPreview.title}/>
            <div>
              <h3>{this.state.linkPreview.title}</h3>
              <p>{this.state.linkPreview.description}</p>
            </div>
          </div>
          <div className="article-links"><span>Bookmark</span><a href={this.props.url} target="_blank">Go to URL...</a></div>
          { this.props.visible && 
            <div className="article-details display-state">
              <h3>Details</h3>
              <ul>
                <li><span>Source:</span><span> {article.source} </span></li>
                <li><span>Headline:</span><span> {article.headline.main} </span></li>
                <li><span>Snippet:</span><span> {article.snippet} </span></li>
                {
                  !!article.byline && <li><span>Author:</span><span> {article.byline.original} </span></li>
                }
                <li><span>Word Count:</span><span> {article.word_count} </span></li>
              </ul>
            </div>
          }
        </div>
      </div>
    );
  }
}

class ArticleDetails extends React.Component {
  render() {
    const article = this.props.selectedArticle;
    return (
      <aside id="details" className="disabled" >
        <div>
          <h3>Article Details</h3>
          {!!Object.keys(article).length &&
          <ul>
            <li><span>Source:</span> {article.source}</li>
            <li><span>Headline:</span> {article.headline.main}</li>
            <li><span>Snippet:</span> {article.snippet}</li>
            {
              !!article.byline &&
              <li><span>Author:</span> {article.byline.original}</li>
            }
            <li><span>Word Count:</span> {article.word_count}</li>
          </ul>
          }
        </div>
      </aside>
    );
  }
}

class Footer extends React.Component {
  render() {
    return (
      <footer id="footer">
        <p>PZORG Demo Project - NYT Explorer</p>
        <p><span>Created By: </span><span>Marjan Sirovljević</span></p>
      </footer>
    );
  }
}

class PageSelect extends React.Component {
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

class PageInfo extends React.Component {
  render() {
    const start = (this.props.pageNumber - 1) * this.props.pageSize + 1;
    const end = start + this.props.displayedElements - 1;
    return (
      <div>Showing <span> {start} - {end} </span> of <span> {this.props.totalArticles} </span>Articles</div>
    );
  }
}

class SortBy extends React.Component {
  constructor(props) {
    super(props);
    this.handleSortByChange = this.handleSortByChange.bind(this);
  }
  handleSortByChange(e) {
    const sortBy = e.target.value;
    // console.log(sortBy);
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

class Search extends React.Component {
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

ReactDOM.render(<App />, document.getElementById('root'));