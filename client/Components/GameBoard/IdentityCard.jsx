import React from 'react';
import { useSelector } from 'react-redux';
import './IdentityCard.scss';
import './PlayerStats.scss';
import IdentityCardImage from '../Decks/IdentityCardImage';
import { Constants } from '../../constants';

const IdentityCard = ({ deck, showDeckName, onMouseOut, onMouseOver }) => {
    const user = useSelector((state) => state.account.user);
    const showAccolades =
        user?.settings?.optionSettings?.showAccolades !== undefined
            ? user.settings.optionSettings.showAccolades
            : true;

    if (!deck.name || !showDeckName) {
        return <div />;
    }

    return (
        <div
            className='state'
            onMouseOver={() =>
                onMouseOver({
                    image: <IdentityCardImage deck={deck} showAccolades={showAccolades} />,
                    size: 'x-large',
                    orientation: 'horizontal'
                })
            }
            onMouseOut={onMouseOut}
        >
            <img
                key='expansion'
                className='img-fluid expansion'
                title={deck.name}
                src={Constants.DeckIconPaths[deck.expansion]}
            />
            {/*<a
                className='link'
                href={'https://www.keyforgegame.com/deck-details/' + deck.uuid}
                target='_blank'
                rel='noopener noreferrer'
            >
                {deck.name}
            </a>*/}
        </div>
    );
};

IdentityCard.displayName = 'IdentityCard';

export default IdentityCard;
