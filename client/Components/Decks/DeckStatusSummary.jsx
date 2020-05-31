import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation, Trans } from 'react-i18next';

class DeckStatusSummary extends React.Component {
    render() {
        let { flagged, verified, noUnreleasedCards } = this.props.status;
        let items = [{ title: 'Only released cards', value: noUnreleasedCards }];
        if (verified) {
            items.push({ title: 'Deck verified', value: true });
        } else if (flagged) {
            items.push({ title: 'Deck requires verification', value: false });
        }

        return (
            <ul className='deck-status-summary'>
                {items.map((item, index) => (
                    <li className={item.value ? 'valid' : 'invalid'} key={index}>
                        <span
                            className={
                                item.value ? 'glyphicon glyphicon-ok' : 'glyphicon glyphicon-remove'
                            }
                        />
                        &nbsp;<Trans>{item.title}</Trans>
                    </li>
                ))}
            </ul>
        );
    }
}

DeckStatusSummary.propTypes = {
    status: PropTypes.object.isRequired
};

export default withTranslation()(DeckStatusSummary);
