import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Constants } from '../constants';
import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import Input from '../Components/Form/Input';
import Checkbox from '../Components/Form/Checkbox';
import CardSizeOption from '../Components/Profile/CardSizeOption';
import GameBackgroundOption from '../Components/Profile/GameBackgroundOption';
import Avatar from '../Components/Site/Avatar';

import * as actions from '../redux/actions';

import { withTranslation, Trans } from 'react-i18next';

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.handleSelectBackground = this.handleSelectBackground.bind(this);
        this.handleSelectCardSize = this.handleSelectCardSize.bind(this);
        this.onUnlinkClick = this.onUnlinkClick.bind(this);
        this.onUpdateAvatarClick = this.onUpdateAvatarClick.bind(this);

        this.state = {
            challongeApiKey: '',
            challongeApiSubdomain: '',
            email: '',
            newPassword: '',
            newPasswordAgain: '',
            optionSettings: {},
            validation: {}
        };
    }

    componentDidMount() {
        this.updateProfile(this.props);
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(props) {
        if (!props.user) {
            return;
        }

        // If we haven't previously got any user details, then the api probably just returned now, so set the initial user details
        if (!this.state.promptedActionWindows) {
            this.updateProfile(props);
        }

        if (props.profileSaved) {
            this.setState({
                successMessage:
                    'Profile saved successfully.  Please note settings changed here may only apply at the start of your next game.'
            });

            this.updateProfile(props);

            setTimeout(() => {
                this.setState({ successMessage: undefined });
            }, 5000);
        }
    }

    translate(label) {
        let labelLocalized = this.props.t(label);
        return labelLocalized[0].toUpperCase() + labelLocalized.slice(1);
    }

    updateProfile(props) {
        if (!props.user) {
            return;
        }

        this.setState({
            challonge: props.user.challonge,
            challongeApiKey: props.user.challonge ? props.user.challonge.key : '',
            challongeApiSubdomain: props.user.challonge ? props.user.challonge.subdomain : '',
            email: props.user.email,
            enableGravatar: !props.user.settings.disableGravatar,
            optionSettings: props.user.settings.optionSettings,
            selectedBackground: props.user.settings.background,
            selectedCardSize: props.user.settings.cardSize
        });
    }

    onChange(field, event) {
        let newState = {};

        newState[field] = event.target.value;
        this.setState(newState);
    }

    onToggle(field, event) {
        let newState = {};

        newState[field] = event.target.checked;
        this.setState(newState);
    }

    onOptionSettingToggle(field, event) {
        let newState = {};

        newState.optionSettings = this.state.optionSettings;
        newState.optionSettings[field] = event.target.checked;

        this.setState(newState);
    }

    onSaveClick(event) {
        event.preventDefault();

        this.setState({ errorMessage: undefined, successMessage: undefined });

        this.verifyEmail();
        this.verifyPassword(true);

        document.getElementsByClassName('wrapper')[0].scrollTop = 0;

        if (
            Object.values(this.state.validation).some((message) => {
                return message && message !== '';
            })
        ) {
            this.setState({
                errorMessage:
                    'There was an error in one or more fields, please see below, correct the error and try again'
            });
            return;
        }

        this.props.saveProfile(this.props.user.username, {
            challonge: {
                key: this.state.challongeApiKey,
                subdomain: this.state.challongeApiSubdomain
            },
            email: this.state.email,
            enableGravatar: this.state.enableGravatar,
            password: this.state.newPassword,
            settings: {
                background: this.state.selectedBackground,
                cardSize: this.state.selectedCardSize,
                optionSettings: this.state.optionSettings
            }
        });
    }

    verifyPassword(isSubmitting) {
        let validation = this.state.validation;

        delete validation['password'];

        if (!this.state.newPassword && !this.state.newPasswordAgain) {
            return;
        }

        if (this.state.newPassword.length < 6) {
            validation['password'] = 'The password you specify must be at least 6 characters long';
        }

        if (isSubmitting && !this.state.newPasswordAgain) {
            validation['password'] = 'Please enter your password again';
        }

        if (
            this.state.newPassword &&
            this.state.newPasswordAgain &&
            this.state.newPassword !== this.state.newPasswordAgain
        ) {
            validation['password'] = 'The passwords you have specified do not match';
        }

        this.setState({ validation: validation });
    }

    verifyEmail() {
        let validation = this.state.validation;

        delete validation['email'];

        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(this.state.email)) {
            validation['email'] = 'Please enter a valid email address';
        }

        this.setState({ validation: validation });
    }

    handleSelectBackground(background) {
        this.setState({ selectedBackground: background });
    }

    handleSelectCardSize(size) {
        this.setState({ selectedCardSize: size });
    }

    onUpdateAvatarClick(event) {
        event.preventDefault();

        this.props.updateAvatar(this.props.user.username);
    }

    onUnlinkClick() {
        this.props.unlinkPatreon();
    }

    isPatreonLinked() {
        return ['linked', 'pledged'].includes(this.props.user.patreon);
    }

    render() {
        let t = this.props.t;

        if (!this.props.user) {
            return (
                <AlertPanel
                    type='error'
                    message={t('You must be logged in to update your profile')}
                />
            );
        }

        let successBar;
        if (this.props.profileSaved) {
            setTimeout(() => {
                this.props.clearProfileStatus();
            }, 5000);
            successBar = (
                <AlertPanel
                    type='success'
                    message={t(
                        'Profile saved successfully.  Please note settings changed here may only apply at the start of your next game.'
                    )}
                />
            );
        }

        let errorBar =
            this.props.apiSuccess === false ? (
                <AlertPanel type='error' message={t(this.props.apiMessage)} />
            ) : null;

        let backgrounds = [
            { name: 'none', label: this.translate('none'), imageUrl: 'img/bgs/blank.png' }
        ];

        for (let i = 0; i < Constants.Houses.length; ++i) {
            backgrounds.push({
                name: Constants.HousesNames[i],
                label: this.translate(Constants.Houses[i]),
                imageUrl: `img/bgs/${Constants.Houses[i]}.png`
            });
        }

        let cardSizes = [
            { name: 'small', label: this.translate('small') },
            { name: 'normal', label: this.translate('normal') },
            { name: 'large', label: this.translate('large') },
            { name: 'x-large', label: this.translate('extra-large') }
        ];

        let callbackUrl =
            process.env.NODE_ENV === 'production'
                ? 'https://thecrucible.online/patreon'
                : 'http://localhost:4000/patreon';

        return (
            <div className='col-sm-8 col-sm-offset-2 profile full-height'>
                <div className='about-container'>
                    {errorBar}
                    {successBar}
                    <form className='form form-horizontal'>
                        <Panel title={t('Profile')}>
                            <Input
                                name='email'
                                label={t('Email Address')}
                                labelClass='col-sm-4'
                                fieldClass='col-sm-8'
                                placeholder={t('Enter email address')}
                                type='text'
                                onChange={this.onChange.bind(this, 'email')}
                                value={this.state.email}
                                onBlur={this.verifyEmail.bind(this)}
                                validationMessage={this.state.validation['email']}
                            />
                            <Input
                                name='newPassword'
                                label={t('New Password')}
                                labelClass='col-sm-4'
                                fieldClass='col-sm-8'
                                placeholder={t('Enter new password')}
                                type='password'
                                onChange={this.onChange.bind(this, 'newPassword')}
                                value={this.state.newPassword}
                                onBlur={this.verifyPassword.bind(this, false)}
                                validationMessage={this.state.validation['password']}
                            />
                            <Input
                                name='newPasswordAgain'
                                label={t('New Password (again)')}
                                labelClass='col-sm-4'
                                fieldClass='col-sm-8'
                                placeholder={t('Enter new password (again)')}
                                type='password'
                                onChange={this.onChange.bind(this, 'newPasswordAgain')}
                                value={this.state.newPasswordAgain}
                                onBlur={this.verifyPassword.bind(this, false)}
                                validationMessage={this.state.validation['password1']}
                            />
                            <Input
                                name='challongeApiKey'
                                label={t('Challonge API Key')}
                                labelClass='col-sm-4'
                                fieldClass='col-sm-8'
                                placeholder={t('Enter Challonge API Key')}
                                type='text'
                                onChange={this.onChange.bind(this, 'challongeApiKey')}
                                value={this.state.challongeApiKey}
                            />
                            <Input
                                name='challongeApiSubdomain'
                                label={t('Challonge API Subdomain')}
                                labelClass='col-sm-4'
                                fieldClass='col-sm-8'
                                placeholder={t('Challonge Community Subdomain')}
                                type='text'
                                onChange={this.onChange.bind(this, 'challongeApiSubdomain')}
                                value={this.state.challongeApiSubdomain}
                            />
                            <span className='col-sm-3 text-center'>
                                <Avatar username={this.props.user.username} />
                            </span>
                            <Checkbox
                                name='enableGravatar'
                                label={t('Enable Gravatar integration')}
                                fieldClass='col-sm-offset-1 col-sm-7'
                                onChange={(e) =>
                                    this.setState({ enableGravatar: e.target.checked })
                                }
                                checked={this.state.enableGravatar}
                            />
                            <div className='col-sm-3 text-center'>
                                <Trans>Current profile picture</Trans>
                            </div>
                            <button
                                type='button'
                                className='btn btn-default col-sm-offset-1 col-sm-4'
                                onClick={this.onUpdateAvatarClick}
                            >
                                <Trans>Update avatar</Trans>
                            </button>
                            {!this.isPatreonLinked() && (
                                <a
                                    className='btn btn-default col-sm-offset-1 col-sm-3'
                                    href={`https://www.patreon.com/oauth2/authorize?response_type=code&client_id=HjDP9KKd-HscTXXMs_2TNl2h_POjaEw7D-EkLv_ShRbarVO_WuKA0LWRBp9LRdLq&redirect_uri=${callbackUrl}`}
                                >
                                    <img
                                        src='/img/Patreon_Mark_Coral.jpg'
                                        style={{ height: '21px' }}
                                    />
                                    &nbsp;<Trans>Link Patreon account</Trans>
                                </a>
                            )}
                            {this.isPatreonLinked() && (
                                <button
                                    type='button'
                                    className='btn btn-default col-sm-offset-1 col-sm-3'
                                    onClick={this.onUnlinkClick}
                                >
                                    <Trans>Unlink Patreon account</Trans>
                                </button>
                            )}
                        </Panel>
                        <div>
                            <Panel title={t('Game Board Background')}>
                                <div className='row'>
                                    {backgrounds.map((background) => (
                                        <GameBackgroundOption
                                            imageUrl={background.imageUrl}
                                            key={background.name}
                                            label={background.label}
                                            name={background.name}
                                            onSelect={this.handleSelectBackground}
                                            selected={
                                                this.state.selectedBackground === background.name
                                            }
                                        />
                                    ))}
                                </div>
                            </Panel>
                        </div>
                        <div>
                            <Panel title={t('Card Image Size')}>
                                <div className='row'>
                                    <div className='col-xs-12'>
                                        {cardSizes.map((cardSize) => (
                                            <CardSizeOption
                                                key={cardSize.name}
                                                label={cardSize.label}
                                                name={cardSize.name}
                                                onSelect={this.handleSelectCardSize}
                                                selected={
                                                    this.state.selectedCardSize === cardSize.name
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                            </Panel>
                        </div>
                        <div>
                            <Panel title={t('Game Settings')}>
                                <Checkbox
                                    name='optionSettings.orderForcedAbilities'
                                    noGroup
                                    label={t('Prompt to order simultaneous abilities')}
                                    fieldClass='col-sm-6'
                                    onChange={this.onOptionSettingToggle.bind(
                                        this,
                                        'orderForcedAbilities'
                                    )}
                                    checked={this.state.optionSettings.orderForcedAbilities}
                                />
                                <Checkbox
                                    name='optionSettings.confirmOneClick'
                                    noGroup
                                    label={t('Show a prompt when initating 1-click abilities')}
                                    fieldClass='col-sm-6'
                                    onChange={this.onOptionSettingToggle.bind(
                                        this,
                                        'confirmOneClick'
                                    )}
                                    checked={this.state.optionSettings.confirmOneClick}
                                />
                            </Panel>
                        </div>
                        <div className='col-sm-offset-10 col-sm-2'>
                            <button
                                className='btn btn-primary'
                                type='button'
                                disabled={this.props.apiLoading}
                                onClick={this.onSaveClick.bind(this)}
                            >
                                <Trans>Save</Trans>
                                {this.props.apiLoading ? (
                                    <span className='spinner button-spinner' />
                                ) : null}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

Profile.displayName = 'Profile';
Profile.propTypes = {
    apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    clearProfileStatus: PropTypes.func,
    i18n: PropTypes.object,
    profileSaved: PropTypes.bool,
    refreshUser: PropTypes.func,
    saveProfile: PropTypes.func,
    socket: PropTypes.object,
    t: PropTypes.func,
    unlinkPatreon: PropTypes.func,
    updateAvatar: PropTypes.func,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        apiLoading: state.api.SAVE_PROFILE ? state.api.SAVE_PROFILE.loading : undefined,
        apiMessage: state.api.SAVE_PROFILE ? state.api.SAVE_PROFILE.message : undefined,
        apiSuccess: state.api.SAVE_PROFILE ? state.api.SAVE_PROFILE.success : undefined,
        profileSaved: state.user.profileSaved,
        socket: state.lobby.socket,
        user: state.account.user
    };
}

export default withTranslation()(connect(mapStateToProps, actions)(Profile));
