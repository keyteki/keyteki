import React from 'react';
import './IdentityCard.scss';
import IdentityCardImage from '../Decks/IdentityCardImage';

const IdentityCard = ({ deck, showDeckName, onMouseOut, onMouseOver }) => {
    if (!deck.name || !showDeckName) {
        return <div />;
    }

    return (
        <div
            className='state'
            onMouseOver={() =>
                onMouseOver({
                    image: <IdentityCardImage deck={deck} />,
                    size: 'x-large'
                })
            }
            onMouseOut={onMouseOut}
        >
            <a
                className='link'
                href={'https://www.keyforgegame.com/deck-details/' + deck.uuid}
                target='_blank'
                rel='noopener noreferrer'
            >
                {deck.name}
            </a>
        </div>
    );
};

IdentityCard.displayName = 'IdentityCard';

export default IdentityCard;
