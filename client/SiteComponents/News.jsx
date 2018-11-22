import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

import NewsItem from './NewsItem.jsx';

class News extends React.Component {
    render() {
        let icons = [
            'military',
            'political'
        ];
        let iconIndex = 0;

        let news = _.map(this.props.news, newsItem => {
            let retNews = <NewsItem key={ newsItem.datePublished } icon={ icons[iconIndex++] } date={ newsItem.datePublished } text={ newsItem.text } />;
            if(iconIndex === 2) {
                iconIndex = 0;
            }

            return retNews;
        });

        if(_.size(news) === 0) {
            news = <div className='military-container'>There is no site news at the moment</div>;
        }

        return (
            <div className='news-container'>
                { news }
            </div>);
    }
}

News.displayName = 'News';
News.propTypes = {
    news: PropTypes.array
};

export default News;
