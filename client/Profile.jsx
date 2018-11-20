import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import $ from 'jquery';
import { connect } from 'react-redux';

import AlertPanel from './SiteComponents/AlertPanel.jsx';
import Input from './FormComponents/Input.jsx';
import Checkbox from './FormComponents/Checkbox.jsx';

import * as actions from './actions';

class InnerProfile extends React.Component {
    constructor(props) {
        super(props);

        if(!this.props.user) {
            return;
        }

        this.state = {
            disableGravatar: this.props.user.settings.disableGravatar,
            email: this.props.user.email,
            loading: false,
            newPassword: '',
            newPasswordAgain: '',
            promptedActionWindows: this.props.user.promptedActionWindows,
            validation: {},
            windowTimer: this.props.user.settings.windowTimer,
            optionSettings: this.props.user.settings.optionSettings,
            timerSettings: this.props.user.settings.timerSettings,
            selectedBackground: this.props.user.settings.background,
            selectedCardSize: this.props.user.settings.cardSize
        };

        this.windows = [
            { name: 'dynasty', label: 'Dynasty phase', style: 'col-sm-4' },
            { name: 'draw', label: 'Draw phase', style: 'col-sm-4' },
            { name: 'preConflict', label: 'Conflict phase', style: 'col-sm-4' },
            { name: 'conflict', label: 'During conflict', style: 'col-sm-4' },
            { name: 'fate', label: 'Fate phase', style: 'col-sm-4' },
            { name: 'regroup', label: 'Regroup phase', style: 'col-sm-4' }
        ];
    }

    componentWillReceiveProps(props) {
        if(!props.user) {
            return;
        }

        this.setState({
            email: props.user.email,
            disableGravatar: props.user.settings.disableGravatar,
            promptedActionWindows: props.user.promptedActionWindows
        });
    }

    onChange(field, event) {
        var newState = {};

        newState[field] = event.target.value;
        this.setState(newState);
    }

    onWindowToggle(field, event) {
        var newState = {};
        newState.promptedActionWindows = this.state.promptedActionWindows;

        newState.promptedActionWindows[field] = event.target.checked;
        this.setState(newState);
    }

    onTimerSettingToggle(field, event) {
        var newState = {};
        newState.timerSettings = this.state.timerSettings;

        newState.timerSettings[field] = event.target.checked;
        this.setState(newState);
    }

    onOptionSettingToggle(field, event) {
        var newState = {};
        newState.optionSettings = this.state.optionSettings;

        newState.optionSettings[field] = event.target.checked;
        this.setState(newState);
    }

    onSaveClick(event) {
        event.preventDefault();

        this.setState({ errorMessage: undefined, successMessage: undefined });

        this.verifyEmail();
        this.verifyPassword(true);

        if(_.any(this.state.validation, function(message) {
            return message && message !== '';
        })) {
            this.setState({ errorMessage: 'There was an error in one or more fields, please see below, correct the error and try again' });
            return;
        }

        this.setState({ loading: true });

        $.ajax('/api/account/' + this.props.user.username,
            {
                method: 'PUT',
                data: {
                    data: JSON.stringify({
                        email: this.state.email,
                        password: this.state.newPassword,
                        promptedActionWindows: this.state.promptedActionWindows,
                        settings: {
                            disableGravatar: this.state.disableGravatar,
                            windowTimer: this.state.windowTimer,
                            optionSettings: this.state.optionSettings,
                            timerSettings: this.state.timerSettings,
                            background: this.state.selectedBackground,
                            cardSize: this.state.selectedCardSize
                        }
                    })
                }
            })
            .done((data) => {
                if(data.success) {
                    this.setState({ successMessage: 'Profile saved successfully.  Please note settings changed here will only apply at the start of your next game' });

                    this.props.socket.emit('authenticate', data.token);
                    this.props.refreshUser(data.user, data.token);
                } else {
                    this.setState({ errorMessage: data.message });
                }
            })
            .always(() => {
                this.setState({ loading: false });
            });
    }

    verifyPassword(isSubmitting) {
        var validation = this.state.validation;

        delete validation['password'];

        if(!this.state.newPassword && !this.state.newPasswordAgain) {
            return;
        }

        if(this.state.newPassword.length < 6) {
            validation['password'] = 'The password you specify must be at least 6 characters long';
        }

        if(isSubmitting && !this.state.newPasswordAgain) {
            validation['password'] = 'Please enter your password again';
        }

        if(this.state.newPassword && this.state.newPasswordAgain && this.state.newPassword !== this.state.newPasswordAgain) {
            validation['password'] = 'The passwords you have specified do not match';
        }

        this.setState({ validation: validation });
    }

    verifyEmail() {
        var validation = this.state.validation;

        delete validation['email'];

        if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(this.state.email)) {
            validation['email'] = 'Please enter a valid email address';
        }

        this.setState({ validation: validation });
    }

    onSlideStop(event) {
        let value = parseInt(event.target.value);

        if(_.isNaN(value)) {
            return;
        }

        if(value < 0) {
            value = 0;
        }

        if(value > 10) {
            value = 10;
        }

        this.setState({ windowTimer: value });
    }

    onBackgroundClick(background) {
        this.setState({ selectedBackground: background });
    }

    onCardClick(size) {
        this.setState({ selectedCardSize: size });
    }

    render() {
        if(!this.props.user) {
            return <AlertPanel type='error' message='You must be logged in to update your profile' />;
        }

        return (
            <div className='col-sm-8 col-sm-offset-2 profile full-height'>
                <div className='about-container'>
                    { this.state.errorMessage ? <AlertPanel type='error' message={ this.state.errorMessage } /> : null }
                    { this.state.successMessage ? <AlertPanel type='success' message={ this.state.successMessage } /> : null }
                    <form className='form form-horizontal'>
                        <div className='panel-title'>
                            Profile
                        </div>
                        <div className='panel'>
                            <Input name='email' label='Email Address' labelClass='col-sm-4' fieldClass='col-sm-8' placeholder='Enter email address'
                                type='text' onChange={ this.onChange.bind(this, 'email') } value={ this.state.email }
                                onBlur={ this.verifyEmail.bind(this) } validationMessage={ this.state.validation['email'] } />
                            <Input name='newPassword' label='New Password' labelClass='col-sm-4' fieldClass='col-sm-8' placeholder='Enter new password'
                                type='password' onChange={ this.onChange.bind(this, 'newPassword') } value={ this.state.newPassword }
                                onBlur={ this.verifyPassword.bind(this, false) } validationMessage={ this.state.validation['password'] } />
                            <Input name='newPasswordAgain' label='New Password (again)' labelClass='col-sm-4' fieldClass='col-sm-8' placeholder='Enter new password (again)'
                                type='password' onChange={ this.onChange.bind(this, 'newPasswordAgain') } value={ this.state.newPasswordAgain }
                                onBlur={ this.verifyPassword.bind(this, false) } validationMessage={ this.state.validation['password1'] } />
                            <Checkbox name='disableGravatar' label='Disable Gravatar integration' fieldClass='col-sm-offset-4 col-sm-8'
                                onChange={ e => this.setState({ disableGravatar: e.target.checked }) } checked={ this.state.disableGravatar } />
                        </div>
                        <div>
                            <div className='panel-title'>
                                Options
                            </div>
                            <div className='panel'>
                                <div className='form-group'>
                                    <Checkbox
                                        name='optionSettings.markCardsUnselectable'
                                        noGroup
                                        label={ 'Grey out cards with no relevant abilities during interrupt/reaction windows' }
                                        fieldClass='col-sm-6'
                                        onChange={ this.onOptionSettingToggle.bind(this, 'markCardsUnselectable') }
                                        checked={ this.state.optionSettings.markCardsUnselectable }
                                    />
                                    <Checkbox
                                        name='optionSettings.orderForcedAbilities'
                                        noGroup
                                        label={ 'Prompt to order forced triggered/simultaneous abilities' }
                                        fieldClass='col-sm-6'
                                        onChange={ this.onOptionSettingToggle.bind(this, 'orderForcedAbilities') }
                                        checked={ this.state.optionSettings.orderForcedAbilities }
                                    />
                                    <Checkbox
                                        name='optionSettings.confirmOneClick'
                                        noGroup
                                        label={ 'Show a confirmation prompt when initating 1-click abilities' }
                                        fieldClass='col-sm-6'
                                        onChange={ this.onOptionSettingToggle.bind(this, 'confirmOneClick') }
                                        checked={ this.state.optionSettings.confirmOneClick }
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='panel-title'>
                                Game Board Background
                            </div>
                            <div className='panel'>
                                <div className='row'>
                                    <div className='col-sm-4' onClick={ () => this.onBackgroundClick('none') }>
                                        <img className={ 'img-responsive' + (this.state.selectedBackground === 'none' ? ' selected' : '') }
                                            src='img/bgs/blank.png' />
                                        <span className='bg-label'>None</span>
                                    </div>
                                    <div className='col-sm-4' onClick={ () => this.onBackgroundClick('Brobnar') }>
                                        <img className={ 'img-responsive' + (this.state.selectedBackground === 'Brobnar' ? ' selected' : '') }
                                            src='/img/bgs/brobnar.png' />
                                        <span className='bg-label'>Brobnar</span>
                                    </div>
                                    <div className='col-sm-4' onClick={ () => this.onBackgroundClick('Dis') }>
                                        <img className={ 'img-responsive' + (this.state.selectedBackground === 'Dis' ? ' selected' : '') }
                                            src='/img/bgs/dis.png' />
                                        <span className='bg-label'>Dis</span>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-sm-4' onClick={ () => this.onBackgroundClick('Logos') }>
                                        <img className={ 'img-responsive' + (this.state.selectedBackground === 'Logos' ? ' selected' : '') }
                                            src='/img/bgs/logos.png' />
                                        <span className='bg-label'>Logos</span>
                                    </div>
                                    <div className='col-sm-4' onClick={ () => this.onBackgroundClick('Mars') }>
                                        <img className={ 'img-responsive' + (this.state.selectedBackground === 'Mars' ? ' selected' : '') }
                                            src='/img/bgs/mars.png' />
                                        <span className='bg-label'>Mars</span>
                                    </div>
                                    <div className='col-sm-4' onClick={ () => this.onBackgroundClick('Sanctum') }>
                                        <img className={ 'img-responsive' + (this.state.selectedBackground === 'Sanctum' ? ' selected' : '') }
                                            src='/img/bgs/sanctum.png' />
                                        <span className='bg-label'>Sanctum</span>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-sm-4' onClick={ () => this.onBackgroundClick('Shadows') }>
                                        <img className={ 'img-responsive' + (this.state.selectedBackground === 'Shadows' ? ' selected' : '') }
                                            src='/img/bgs/shadows.png' />
                                        <span className='bg-label'>Shadows</span>
                                    </div>
                                    <div className='col-sm-4' onClick={ () => this.onBackgroundClick('Untamed') }>
                                        <img className={ 'img-responsive' + (this.state.selectedBackground === 'Untamed' ? ' selected' : '') }
                                            src='/img/bgs/untamed.jpg' />
                                        <span className='bg-label'>Untamed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='panel-title'>
                                Card Image Size
                            </div>
                            <div className='panel'>
                                <div className='row'>
                                    <div className='col-xs-12'>
                                        <div className='card-settings' onClick={ () => this.onCardClick('small') }>
                                            <div className={ 'card small vertical' + (this.state.selectedCardSize === 'small' ? ' selected' : '') }>
                                                <img className='card small vertical'
                                                    src='img/idbacks/identity.jpg' />
                                            </div>
                                            <span className='bg-label'>Small</span>
                                        </div>
                                        <div className='card-settings' onClick={ () => this.onCardClick('normal') }>
                                            <div className={ 'card vertical' + (this.state.selectedCardSize === 'normal' ? ' selected' : '') }>
                                                <img className='card vertical'
                                                    src='img/idbacks/identity.jpg' />
                                            </div>
                                            <span className='bg-label'>Normal</span>
                                        </div>
                                        <div className='card-settings' onClick={ () => this.onCardClick('large') }>
                                            <div className={ 'card vertical large' + (this.state.selectedCardSize === 'large' ? ' selected' : '') } >
                                                <img className='card-image large vertical'
                                                    src='/img/idbacks/identity.jpg' />
                                            </div>
                                            <span className='bg-label'>Large</span>
                                        </div>
                                        <div className='card-settings' onClick={ () => this.onCardClick('x-large') }>
                                            <div className={ 'card vertical x-large' + (this.state.selectedCardSize === 'x-large' ? ' selected' : '') }>
                                                <img className='card-image x-large vertical'
                                                    src='img/idbacks/identity.jpg' />
                                            </div>
                                            <span className='bg-label'>Extra-Large</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-offset-10 col-sm-2'>
                            <button className='btn btn-primary' type='button' disabled={ this.state.loading } onClick={ this.onSaveClick.bind(this) }>Save</button>
                        </div>
                    </form>
                </div>
            </div>);
    }
}

InnerProfile.displayName = 'Profile';
InnerProfile.propTypes = {
    refreshUser: PropTypes.func,
    socket: PropTypes.object,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        socket: state.socket.socket,
        user: state.auth.user
    };
}

const Profile = connect(mapStateToProps, actions)(InnerProfile);

export default Profile;
