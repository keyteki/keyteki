import React from 'react';
import { Trans } from 'react-i18next';

import NewsItem from './NewsItem';

import './News.scss';

/**
 * @typedef News
 * @property {Date} datePublished When the news was published
 * @property {string} text The text of the news
 */

/**
 * @typedef NewsProps
 * @property {News[]} news
 */

/**
 *
 * @param {NewsProps} props
 */
const News = ({ news }) => {
    /**
     * @type import('./NewsItem').NewsIcon[]
     */
    let icons = ['unforged-red', 'unforged-blue', 'unforged-yellow'];

    let iconIndex = 0;
    let newsIndex = 0;
    let renderedNews = news.map((newsItem) => {
        let retNews = (
            <NewsItem
                key={newsIndex++}
                icon={icons[iconIndex++]}
                date={newsItem.datePublished}
                text={newsItem.text}
            />
        );

        if (iconIndex === 3) {
            iconIndex = 0;
        }

        return retNews;
    });

    if (renderedNews.length === 0) {
        renderedNews.push(<Trans key='nonews'>There is no site news at the moment</Trans>);
    }

    return <div className='news-container'>{renderedNews}</div>;
};

News.displayName = 'News';

export default News;
