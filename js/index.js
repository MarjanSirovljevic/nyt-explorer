class App extends React.Component {

  render() {

    const jsx = (
      <div id="page">
        <header id="header">HEADER</header>
        <main id="main">
          <section id="top">TOP</section>
          <section id="center">
            <aside id="gallery">GALLERY</aside>
            <aside id="details" className="disabled">DETAILS</aside>
          </section>
          <section id="bottom">BOTTOM</section>
        </main>
        <footer id="footer">FOOTER</footer>
      </div>
    );

    return jsx;
  }
}

ReactDOM.render(<App />, document.getElementById('root'));