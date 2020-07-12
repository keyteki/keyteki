import React from 'react';
import PropTypes from 'prop-types';
import Panel from '../Components/Site/Panel';

import { withTranslation, Trans } from 'react-i18next';

class Privacy extends React.Component {
    render() {
        let t = this.props.t;

        return (
            <div className='col-xs-12 full-height'>
                <Panel title={t('Privacy Policy')}>
                    <h3>
                        <Trans>Background</Trans>
                    </h3>

                    <p>
                        <Trans i18nKey='privacy.background'>
                            Even though this is only a site to play a card game online, we still
                            take your privacy and the security of your data seriously. This policy
                            outlines what data we store about you, why we store it and what we do
                            with it.
                        </Trans>
                    </p>

                    <h3>
                        <Trans>What data we store</Trans>
                    </h3>
                    <Trans i18nKey='privacy.whatwestore'>
                        <p>
                            When you sign up for the site (which is required to play or spectate on
                            games), we collect a username, your email address, a password and the IP
                            address of the computer you&quot;re using when you sign up.
                        </p>
                        <p>
                            When you play games on the site, we collect information about the games
                            you play(what faction/agenda you&quot;re using, the deck you are using
                            to play with - but not its contents, who you are playing against and the
                            outcome of the game).
                        </p>
                        <p>If you chat in the lobby, your messages are stored.</p>
                    </Trans>

                    <h3>
                        <Trans>Why we collect it</Trans>
                    </h3>
                    <p>
                        <Trans i18nKey='privacy.why'>
                            We collect a username to identify you on the site and so that people
                            know who they are playing against.
                        </Trans>
                    </p>
                    <p>
                        <Trans i18nKey='privacy.whyemail'>Your email address is used</Trans>:
                    </p>
                    <ul>
                        <li>
                            <Trans i18nKey='privacy.whyemail.1'>
                                in order to verify that you are a real person and not an automated
                                program(or &quot;bot&quot;).
                            </Trans>
                        </li>
                        <li>
                            <Trans i18nKey='privacy.whyemail.2'>
                                to enchance the security and general environment of the site by
                                allowing us to restrict people to one account per email address, or
                                to prevent a user using the site.
                            </Trans>
                        </li>
                        <li>
                            <Trans i18nKey='privacy.whyemail.4'>
                                to allow you to reset your password if you forget it
                            </Trans>
                        </li>
                        <li>
                            <Trans i18nKey='privacy.whyemail.5'>
                                to send you critical updates about the site from time to time (We
                                have to date never sent one of these)
                            </Trans>
                        </li>
                    </ul>
                    <p>
                        <Trans i18nKey='privacy.ipaddress'>
                            The IP address of the computer you use is collected in order to protect
                            the security and integrity of the site and allow us to prevent abuse of
                            the site.
                        </Trans>
                    </p>
                    <p>
                        <Trans i18nKey='privacy.lobby'>
                            Your lobby messages are stored so that we can display them to other
                            users of the site and to detect patterns of abusive behaviour. Your
                            messages may also be moderated to remove offensive content, or deleted
                            altogether at our discretion.
                        </Trans>
                    </p>
                </Panel>
            </div>
        );
    }
}

Privacy.displayName = 'Privacy';
Privacy.propTypes = {
    i18n: PropTypes.object,
    t: PropTypes.func
};

export default withTranslation()(Privacy);
