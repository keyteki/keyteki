import React from 'react';

import AlertPanel from '../Site/AlertPanel';
import NewsItem from './NewsItem';

const News = ({ news = [] }) => {
    let icons = ['unforged-red', 'unforged-blue', 'unforged-yellow'];
    let iconIndex = 0;
    const renderedNews = news.news.map((newsItem, newsIndex) => {
        return <NewsItem key={newsIndex} icon={icons[iconIndex++ % 3]} newsItem={newsItem} />;
    });

    if (renderedNews.length === 0) {
        renderedNews.push(
            <AlertPanel key={0} variant='info'>
                There is no site news at the moment
            </AlertPanel>
        );
    }

    return <div className='overflow-y-auto'>{renderedNews}</div>;
};

News.displayName = 'News';

export default News;
