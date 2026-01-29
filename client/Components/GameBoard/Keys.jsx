import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { sendGameMessage } from '../../redux/actions';

const KeyImages = {};
const KeyColours = ['red', 'blue', 'yellow'];
for (const colour of KeyColours) {
    KeyImages[colour] = {
        forged: require(`../../assets/img/forgedkey${colour}.png`),
        unforged: require(`../../assets/img/unforgedkey${colour}.png`)
    };
}

const Keys = ({ keys, manualMode }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    let keysToRender = KeyColours.sort((a, b) => {
        if (keys[a] === keys[b]) {
            return 0;
        }

        return keys[a] ? -1 : 1;
    }).map((colour) => {
        return (
            <img
                className={
                    keys[colour] && KeyImages[colour].forged
                        ? 'forged-key'
                        : 'unforged-key' + ' img-fluid'
                }
                key={`key ${colour}`}
                src={keys[colour] ? KeyImages[colour].forged : KeyImages[colour].unforged}
                onClick={() => {
                    if (manualMode) {
                        dispatch(sendGameMessage('modifyKey', colour, keys[colour]));
                    }
                }}
                title={t('Forged Key')}
            />
        );
    });

    return <div className={`state`}>{keysToRender}</div>;
};

export default Keys;
