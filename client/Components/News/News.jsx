import React from 'react';
import PropTypes from 'prop-types';

import NewsItem from './NewsItem';

import { withTranslation, Trans } from 'react-i18next';

class News extends React.Component {
    render() {
        let icons = [
            'amber',
            'power',
            'armor'
        ];

        let iconIndex = 0;
        let news = this.props.news.map(newsItem => {
            let retNews = <NewsItem key={ newsItem.datePublished } icon={ icons[iconIndex++] } date={ newsItem.datePublished } text={ newsItem.text } />;
            if(iconIndex === 3) {
                iconIndex = 0;
            }

            return retNews;
        });

        if(news.length === 0) {
            news = <div className='military-container'><Trans>There is no site news at the moment</Trans></div>;
        }

        return (
            <div className='news-container'>
                { news }
            </div>);
    }
}

News.displayName = 'News';
News.propTypes = {
    i18n: PropTypes.object,
    news: PropTypes.array,
    t: PropTypes.func
};

export default withTranslation()(News);
