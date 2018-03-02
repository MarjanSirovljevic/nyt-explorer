class App extends React.Component {
  render() {
    const jsx = (
      <div id="page">
        <Header />
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
      <header id="header">Header Component</header>
    );
  }
}

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