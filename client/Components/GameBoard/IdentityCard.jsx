import React from 'react';
import { useSelector } from 'react-redux';
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
                className='expansion block h-auto max-w-full'
                title={deck.name}
                src={Constants.DeckIconPaths[deck.expansion]}
            />
            {/*<a
                className='cursor-pointer text-emerald-500 hover:text-cyan-400'
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
