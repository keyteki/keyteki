import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { gameSendMessage } from '../../redux/socketActions';

const KeyImages = {};
const KeyColours = ['red', 'blue', 'yellow'];
for (const colour of KeyColours) {
    KeyImages[colour] = {
        forged: new URL(`../../assets/img/forgedkey${colour}.png`, import.meta.url).href,
        unforged: new URL(`../../assets/img/unforgedkey${colour}.png`, import.meta.url).href
    };
}

const Keys = ({ keys, manualMode }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    let keysToRender = [...KeyColours]
        .sort((a, b) => {
            if (keys[a] === keys[b]) {
                return 0;
            }

            return keys[a] ? -1 : 1;
        })
        .map((colour) => {
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
                            dispatch(gameSendMessage('modifyKey', colour, keys[colour]));
                        }
                    }}
                    title={t('Forged Key')}
                />
            );
        });

    return <div className={`state`}>{keysToRender}</div>;
};

export default Keys;
