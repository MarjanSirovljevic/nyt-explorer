class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleYMChange = this.handleYMChange.bind(this);
    this.state = {
      yearMonth: []
    };
  }
  handleYMChange(yearMonthStr) {
    const yearMonth = yearMonthStr.split('-');
    this.setState(() => ({ yearMonth }));
  }
  render() {
    console.log(this.state.yearMonth);
    const jsx = (
      <div id="page">
        <Header handleYMChange={this.handleYMChange}/>
        <main id="main">
          <section id="top">TOP</section>
          <section id="center">
            <Articles />
            <ArticleDetails />
          </section>
          <section id="bottom">BOTTOM</section>
        </main>
        <Footer />
      </div>
    );
    return jsx;
  }
}

class Header extends React.Component {
  render() {
    return (
      <header id="header">
        <h1><span></span></h1>
        <FindArticles
          handleYMChange={this.props.handleYMChange}
        />
      </header>
    );
  }
}

class FindArticles extends React.Component {
  constructor(props) {
    super(props);
    this.handleYMChange = this.handleYMChange.bind(this);
  }
  handleYMChange(e) {
    const yearMonthStr = e.target.value;
    this.props.handleYMChange(yearMonthStr);
  }
  render() {
    return (
      <form className="header-form">
        <input type="month" onChange={this.handleYMChange} />
        <input type="submit" value="Find" />
      </form>
    );
  }
};

class Articles extends React.Component {
  render() {
    return (
      <aside id="gallery">Articles Component</aside>
    );
  }
}

class ArticleDetails extends React.Component {
  render() {
    const article = this.props.selectedArticle;
    return (
      <aside id="details" className="disabled">Details Component</aside>
    );
  }
}

class Footer extends React.Component {
  render() {
    return (
      <footer id="footer">Footer Component</footer>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));