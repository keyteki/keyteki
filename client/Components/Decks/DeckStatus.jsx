import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import DeckStatusSummary from './DeckStatusSummary';
import StatusPopOver from './StatusPopOver';

import { withTranslation } from 'react-i18next';

class DeckStatus extends React.Component {
    render() {
        let { status, t } = this.props;
        let statusName;
        let className = classNames('deck-status', this.props.className, {
            'used': status.usageLevel === 1 && !status.verified,
            'popular': status.usageLevel === 2 && !status.verified,
            'notorious': status.usageLevel === 3 && !status.verified,
            'casual-play': status.basicRules && !status.noUnreleasedCards,
            'valid': (status.usageLevel === 0 || status.verified) && status.basicRules && status.noUnreleasedCards
        });

        if(status.usageLevel === 1 && !status.verified) {
            statusName = t('Used');
        } else if(status.usageLevel === 2 && !status.verified) {
            statusName = t('Popular');
        } else if(status.usageLevel === 3 && !status.verified) {
            statusName = t('Notorious');
        } else if(!status.noUnreleasedCards) {
            statusName = t('Casual play only');
        } else {
            statusName = t('Valid');
        }

        return (
            <span className={ className }>
                <StatusPopOver status={ statusName } show>
                    <div>
                        <DeckStatusSummary status={ status } />
                        { status.extendedStatus && status.extendedStatus.length !== 0 &&
                            <ul className='deck-status-errors'>
                                { status.extendedStatus.map((error, index) => <li key={ index }>{ error }</li>) }
                            </ul>
                        }
                    </div>
                </StatusPopOver>
            </span>);
    }
}

DeckStatus.propTypes = {
    className: PropTypes.string,
    i18n: PropTypes.object,
    status: PropTypes.object.isRequired,
    t: PropTypes.func
};

export default withTranslation()(DeckStatus);
