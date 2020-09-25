import React from 'react';

import CardImage from './CardImage';

import './CardZoom.scss';
import { withTranslation } from 'react-i18next';

const CardZoom = ({ card, cardName, t }) => {
    if (!card) {
        return null;
    }

    const getKeywords = (keywords) => {
        return keywords.map((keyword) => {
            return (
                <div className='keyword-container' key={keyword}>
                    <strong>{t(keyword)}</strong>
                    <p>{t(keyword + '_text')}</p>
                </div>
            );
        });
    };

    const size = card.type === 'decklist' ? 'x-large' : 'normal';
    return (
        <div className={`card-zoom ${size} vertical`}>
            <div className='card-zoomed shadow'>
                {card.imageUrl ? (
                    <div className='card-zoomed shadow'>
                        <img className={`image-zoom ${size} img-fluid`} src={card.imageUrl} />
                    </div>
                ) : (
                    <div className='card-zoomed shadow'>
                        <span className='card-name'>{cardName}</span>
                        <CardImage card={card} />
                    </div>
                )}
                {card.keywords.length != 0 && (
                    <div className='keywords-container'>
                        <div className='keywords'>{getKeywords(card.keywords)}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

CardZoom.displayName = 'CardZoom';

export default withTranslation()(CardZoom);
