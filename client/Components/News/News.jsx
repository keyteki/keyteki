import React from 'react';
import { Trans } from 'react-i18next';

import NewsItem from './NewsItem';

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
    const icons = ['unforged-red', 'unforged-blue', 'unforged-yellow'];

    let iconIndex = 0;
    let newsIndex = 0;
    const renderedNews = news.map((newsItem) => {
        const retNews = (
            <NewsItem
                key={newsIndex++}
                icon={icons[iconIndex++]}
                date={newsItem.datePublished}
                poster={newsItem.poster}
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

    return <div className='pe-1'>{renderedNews}</div>;
};

News.displayName = 'News';

export default News;
