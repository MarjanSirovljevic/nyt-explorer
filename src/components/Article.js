import React from 'react';
import $ from 'jquery';

export default class Article extends React.Component {
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