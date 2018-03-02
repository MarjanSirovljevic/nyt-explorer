class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleYMChange = this.handleYMChange.bind(this);
    this.handleYMSubmit = this.handleYMSubmit.bind(this);
    this.handleArticleClick = this.handleArticleClick.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    const currentDate = new Date();
    this.state = {
      yearMonth: [currentDate.getFullYear(), currentDate.getMonth()],
      fetchedArticles: [],
      pageNumber: 1,
      pageSize: 4,
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
  componentDidMount() {
    this.handleYMSubmit();
  }
  render() {
    const start = (this.state.pageNumber - 1) * this.state.pageSize;
    const end = start + this.state.pageSize;
    const articles = this.state.fetchedArticles;
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
          <section id="top">TOP</section>
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
          <img src=".././images/loader.gif" />
        </div>
      </div>
    );

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

ReactDOM.render(<App />, document.getElementById('root'));