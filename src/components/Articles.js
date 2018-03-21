import React from 'react';
import Article from './Article';

const Articles = (props) => (
  <aside id="gallery" className="gutters">
    { 
      props.articlesToShow.map((article) => {
        const visible = !!Object.keys(props.selectedArticle).length && props.selectedArticle._id === article._id;
        return (
          <Article
            key={article._id}
            visible={visible}
            handleArticleClick={props.handleArticleClick}
            article={article}
            url={article.web_url}
            date={article.pub_date}
          />
        );
      })
    }
  </aside>
);

export default Articles;