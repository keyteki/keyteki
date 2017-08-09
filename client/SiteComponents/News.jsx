import React from 'react';
import _ from 'underscore';

import NewsItem from './NewsItem.jsx';

class News extends React.Component {
    render() {
        let icons = [
            'military',
            'intrigue',
            'power'
        ];
        let iconIndex = 0;

        let news = _.map(this.props.news, newsItem => {
            let retNews = <NewsItem key={ newsItem.datePublished } icon={ icons[iconIndex++] } date={ newsItem.datePublished } text={ newsItem.text } />;
            if(iconIndex === 3) {
                iconIndex = 0;
            }

            return retNews;
        });

        return (
            <div>
                { news }
            </div>);
    }
}

News.displayName = 'News';
News.propTypes = {
    news: React.PropTypes.array
};

export default News;
