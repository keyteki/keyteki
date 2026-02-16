import React from 'react';
import moment from 'moment';

import { getMessageWithLinks } from '../../util.jsx';
import UnforgedRed from '../../assets/img/unforgedkeyred.png';
import UnforgedBlue from '../../assets/img/unforgedkeyblue.png';
import UnforgedYellow from '../../assets/img/unforgedkeyyellow.png';

/**
 * @typedef {'unforged-red' | 'unforged-blue'| 'unforged-yellow'} NewsIcon
 */

/**
 * @typedef NewsItemProps
 * @property {Date} date The date the news item was posted
 * @property {NewsIcon} icon The icon to display
 * @property {string} [poster] The username/name who posted the news item
 * @property {string} text The text of the news
 */

/**
 *
 * @param {NewsItemProps} props
 */
const NewsItem = ({ date, icon, poster, text }) => {
    const parts = getMessageWithLinks(text);
    const icons = {
        'unforged-blue': UnforgedBlue,
        'unforged-red': UnforgedRed,
        'unforged-yellow': UnforgedYellow
    };
    const iconPath = icons[icon];

    return (
        <div className="relative flex min-h-9 items-center border-b border-dotted border-border/80 py-1.5 text-muted [&:first-child::before]:absolute [&:first-child::before]:-left-3 [&:first-child::before]:top-0 [&:first-child::before]:bottom-0 [&:first-child::before]:w-1 [&:first-child::before]:bg-accent [&:first-child::before]:content-[''] [&:first-child_.news-item-title]:font-medium [&:first-child_.news-item-title]:text-foreground">
            <span
                className='me-2 inline-block h-[18px] min-w-[18px] bg-contain bg-center bg-no-repeat'
                style={{ backgroundImage: `url('${iconPath}')` }}
            />
            <span className='inline-flex items-center text-xs leading-5 text-muted'>
                {moment(date).format('YYYY-MM-DD')}
            </span>
            {poster ? (
                <>
                    <span className='mx-2 inline-flex items-center leading-5 text-muted'>
                        &middot;
                    </span>
                    <span className='inline-flex items-center text-xs leading-5 text-muted'>
                        {poster}
                    </span>
                </>
            ) : null}
            <span className='mx-2 inline-flex items-center leading-5 text-muted'>&middot;</span>
            <span className='news-item-title inline-flex items-center leading-5 text-foreground/72'>
                {parts}
            </span>
        </div>
    );
};

NewsItem.displayName = 'NewsItem';

export default NewsItem;
