import React from 'react';

const ArticleDetails = (props) => {
  const article = props.selectedArticle;
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

export default ArticleDetails;