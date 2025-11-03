import React from 'react';
import moment from 'moment';

import { getMessageWithLinks } from '../../util.jsx';
import redKey from '../../assets/img/unforgedkeyred.png';
import blueKey from '../../assets/img/unforgedkeyblue.png';
import yellowKey from '../../assets/img/unforgedkeyyellow.png';

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

    const iconMap = {
        'unforged-red': redKey,
        'unforged-blue': blueKey,
        'unforged-yellow': yellowKey
    };

    return (
        <div className='flex py-1.5 leading-5 border-b border-dotted border-slate-400 text-slate-300 first:border-t first:border-dotted first:border-slate-400 first:bg-rose-500/20 first:text-slate-800'>
            <div
                className='bg-center bg-no-repeat bg-contain float-left text-center h-5 min-w-5 w-5 mt-0.5 ml-1.5 mr-0.5'
                style={{ backgroundImage: `url(${iconMap[icon]})` }}
            />
            &nbsp;{moment(date).format('YYYY-MM-DD') + ' - '}
            {parts}
        </div>
    );
};

NewsItem.displayName = 'NewsItem';

export default NewsItem;
