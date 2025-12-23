import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ButtonGroup, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';

import ConfirmButton from '../Form/ConfirmButton';
import DeckSummary from './DeckSummary';
import Panel from '../Site/Panel';
import { deleteDeck, refreshAccolades } from '../../redux/actions';

/**
 * @typedef ViewDeckProps
 * @property {import('./DeckList').Deck} deck The currently selected deck
 */

/**
 * @param {ViewDeckProps} props
 */
const ViewDeck = ({ deck }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const user = useSelector((state) => state.account.user);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const showAccolades =
        user?.settings?.optionSettings?.showAccolades !== undefined
            ? user.settings.optionSettings.showAccolades
            : true;

    const handleDeleteClick = () => {
        dispatch(deleteDeck(deck));
    };

    const handleRefreshAccolades = async () => {
        setIsRefreshing(true);
        try {
            await dispatch(refreshAccolades(deck.id));
        } finally {
            setIsRefreshing(false);
        }
    };

    const titleContent = (
        <div style={{ position: 'relative', width: '100%' }}>
            <span style={{ display: 'block', textAlign: 'center' }}>{deck.name}</span>
            {showAccolades && (
                <button
                    onClick={handleRefreshAccolades}
                    disabled={isRefreshing}
                    className='btn btn-sm btn-link'
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        padding: '2px 4px',
                        color: 'inherit',
                        border: 'none',
                        opacity: isRefreshing ? 0.6 : 1,
                        cursor: isRefreshing ? 'wait' : 'pointer'
                    }}
                    title={t('Refresh accolades')}
                >
                    <FontAwesomeIcon icon={faSync} spin={isRefreshing} />
                </button>
            )}
        </div>
    );

    return (
        <Panel title={titleContent}>
            <Col xs={12} className='text-center'>
                <ButtonGroup>
                    <ConfirmButton onClick={handleDeleteClick}>
                        <Trans>Delete</Trans>
                    </ConfirmButton>
                </ButtonGroup>
            </Col>
            <DeckSummary deck={deck} />
        </Panel>
    );
};

export default ViewDeck;
