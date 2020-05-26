import React from 'react';
import moment from 'moment';

import { getMessageWithLinks } from '../../util';

import './NewsItem.scss';
import { Col } from 'react-bootstrap';

/**
 * @typedef {'unforged-red' | 'unforged-blue'| 'unforged-yellow'} NewsIcon
 */

/**
 * @typedef NewsItemProps
 * @property {Date} date The date the news item was posted
 * @property {NewsIcon} icon The icon to display
 * @property {string} text The text of the news
 */

/**
 *
 * @param {NewsItemProps} props
 */
const NewsItem = ({ date, icon, text }) => {
    let parts = getMessageWithLinks(text);

    return (
        <div className='news-item'>
            <div className={`news-icon ${icon}`} />
            &nbsp;{moment(date).format('YYYY-MM-DD') + ' - '}
            {parts}
        </div>
    );
};

NewsItem.displayName = 'NewsItem';

export default NewsItem;
