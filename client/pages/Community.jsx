import React from 'react';
import PropTypes from 'prop-types';
import Panel from '../Components/Site/Panel';

import { withTranslation, Trans } from 'react-i18next';

class Community extends React.Component {
    render() {
        let t = this.props.t;

        return (
            <div className='col-xs-12 full-height'>
                <Panel title={ t('The Crucible Online - Community Information') }>
                    <h3><Trans>What is this page?</Trans></h3>
                    <p><Trans i18nKey='community.whatisthis'>This page is a shoutout to other works/resources in the KeyForge community.</Trans></p>

                    <h3>KeyForge Discord</h3>
                    <Trans i18nKey='community.discord'>
                        <p>Link: <a href='https://discordapp.com/invite/PcTGhr9' target='_blank' rel='noopener noreferrer'>Keyforge Discord</a></p>
                        <p>Discord is a text and voice communicaton application. Created by members of the Keyforge community, it&apos;s a robust community of LCG/CCG/RPG players.</p>
                    </Trans>

                    <h3><Trans>UNDER CONSTRUCTION</Trans></h3>
                </Panel>
            </div>
        );
    }
}

Community.displayName = 'Community';
Community.propTypes = {
    i18n: PropTypes.object,
    t: PropTypes.func
};

export default withTranslation()(Community);
