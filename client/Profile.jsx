import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import $ from 'jquery';
import { connect } from 'react-redux';

import AlertPanel from './SiteComponents/AlertPanel.jsx';
import Input from './FormComponents/Input.jsx';
import Checkbox from './FormComponents/Checkbox.jsx';
import Slider from 'react-bootstrap-slider';

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

        let windows = _.map(this.windows, window => {
            return (<Checkbox key={ window.name }
                noGroup
                name={ 'promptedActionWindows.' + window.name }
                label={ window.label }
                fieldClass={ window.style }
                type='checkbox'
                onChange={ (this.onWindowToggle.bind(this, window.name)) }
                checked={ this.state.promptedActionWindows[window.name] } />);
        });

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
                                Action window defaults
                            </div>
                            <div className='panel'>
                                <p className='help-block small'>If an option is selected here, you will always be prompted if you want to take an action in that window.  If an option is not selected, you will receive no prompts for that window.  For some windows (e.g. dominance) this could mean the whole window is skipped.</p>
                                <div className='form-group'>
                                    { windows }
                                </div>
                            </div>
                            <div className='panel-title'>
                                Timed Interrupt Window
                            </div>
                            <div className='panel'>
                                <p className='help-block small'>Every time a game event occurs that you could possibly interrupt to cancel it, a timer will count down.  At the end of that timer, the window will automatically pass.
                                This option controls the duration of the timer.  The timer will only show when you *don't* have an ability which can be used. The timer can be configure to show when events are played (useful if you play cards like Voice of Honor) and to show when card abilities are triggered.</p>
                                <div className='form-group'>
                                    <label className='col-sm-3 control-label'>Window timeout</label>
                                    <div className='col-sm-5'>
                                        <Slider value={ this.state.windowTimer }
                                            slideStop={ this.onSlideStop.bind(this) }
                                            step={ 1 }
                                            max={ 10 }
                                            min={ 0 } />
                                    </div>
                                    <div className='col-sm-2'>
                                        <input className='form-control text-center' name='timer' value={ this.state.windowTimer } onChange={ this.onSlideStop.bind(this) } />
                                    </div>
                                    <label className='col-sm-1 control-label'>seconds</label>

                                    <Checkbox name='timerSettings.events' noGroup label={ 'Show timer for events' } fieldClass='col-sm-6'
                                        onChange={ this.onTimerSettingToggle.bind(this, 'events') } checked={ this.state.timerSettings.events } />
                                    <Checkbox name='timerSettings.abilities' noGroup label={ 'Show timer for card abilities' } fieldClass='col-sm-6'
                                        onChange={ this.onTimerSettingToggle.bind(this, 'abilities') } checked={ this.state.timerSettings.abilities } />
                                </div>
                            </div>
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
                                        name='optionSettings.cancelOwnAbilities'
                                        noGroup
                                        label={ 'Prompt to cancel/react to initiation of my own abilities' }
                                        fieldClass='col-sm-6'
                                        onChange={ this.onOptionSettingToggle.bind(this, 'cancelOwnAbilities') }
                                        checked={ this.state.optionSettings.cancelOwnAbilities } />
                                    <Checkbox
                                        name='optionSettings.showStatusInSidebar'
                                        noGroup
                                        label={
                                            'Show player status in the sidebar, instead of horizontal bars.' +
                                            ' Useful to free up space for cards on smaller screens.'
                                        }
                                        fieldClass='col-sm-6'
                                        onChange={ this.onOptionSettingToggle.bind(this, 'showStatusInSidebar') }
                                        checked={ this.state.optionSettings.showStatusInSidebar }
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
                                            src='img/blank.png' />
                                        <span className='bg-label'>None</span>
                                    </div>
                                    <div className='col-sm-4' onClick={ () => this.onBackgroundClick('CRAB') }>
                                        <img className={ 'img-responsive' + (this.state.selectedBackground === 'CRAB' ? ' selected' : '') }
                                            src='/img/bgs/crab.jpg' />
                                        <span className='bg-label'>Crab</span>
                                    </div>
                                    <div className='col-sm-4' onClick={ () => this.onBackgroundClick('CRANE') }>
                                        <img className={ 'img-responsive' + (this.state.selectedBackground === 'CRANE' ? ' selected' : '') }
                                            src='/img/bgs/crane.jpg' />
                                        <span className='bg-label'>Crane</span>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-sm-4' onClick={ () => this.onBackgroundClick('DRAGON') }>
                                        <img className={ 'img-responsive' + (this.state.selectedBackground === 'DRAGON' ? ' selected' : '') }
                                            src='/img/bgs/dragon.jpg' />
                                        <span className='bg-label'>Dragon</span>
                                    </div>
                                    <div className='col-sm-4' onClick={ () => this.onBackgroundClick('LION') }>
                                        <img className={ 'img-responsive' + (this.state.selectedBackground === 'LION' ? ' selected' : '') }
                                            src='/img/bgs/lion.jpg' />
                                        <span className='bg-label'>Lion</span>
                                    </div>
                                    <div className='col-sm-4' onClick={ () => this.onBackgroundClick('MANTIS') }>
                                        <img className={ 'img-responsive' + (this.state.selectedBackground === 'MANTIS' ? ' selected' : '') }
                                            src='/img/bgs/mantis.jpg' />
                                        <span className='bg-label'>Mantis</span>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-sm-4' onClick={ () => this.onBackgroundClick('PHOENIX') }>
                                        <img className={ 'img-responsive' + (this.state.selectedBackground === 'PHOENIX' ? ' selected' : '') }
                                            src='/img/bgs/phoenix.jpg' />
                                        <span className='bg-label'>Phoenix</span>
                                    </div>
                                    <div className='col-sm-4' onClick={ () => this.onBackgroundClick('SCORPION') }>
                                        <img className={ 'img-responsive' + (this.state.selectedBackground === 'SCORPION' ? ' selected' : '') }
                                            src='/img/bgs/scorpion.jpg' />
                                        <span className='bg-label'>Scorpion</span>
                                    </div>
                                    <div className='col-sm-4' onClick={ () => this.onBackgroundClick('SPIDER') }>
                                        <img className={ 'img-responsive' + (this.state.selectedBackground === 'SPIDER' ? ' selected' : '') }
                                            src='/img/bgs/spider.jpg' />
                                        <span className='bg-label'>Spider</span>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-sm-4' onClick={ () => this.onBackgroundClick('UNICORN') }>
                                        <img className={ 'img-responsive' + (this.state.selectedBackground === 'UNICORN' ? ' selected' : '') }
                                            src='/img/bgs/unicorn.jpg' />
                                        <span className='bg-label'>Unicorn</span>
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
                                                    src='img/cards/dynastycardback.jpg' />
                                            </div>
                                            <span className='bg-label'>Small</span>
                                        </div>
                                        <div className='card-settings' onClick={ () => this.onCardClick('normal') }>
                                            <div className={ 'card vertical' + (this.state.selectedCardSize === 'normal' ? ' selected' : '') }>
                                                <img className='card vertical'
                                                    src='img/cards/dynastycardback.jpg' />
                                            </div>
                                            <span className='bg-label'>Normal</span>
                                        </div>
                                        <div className='card-settings' onClick={ () => this.onCardClick('large') }>
                                            <div className={ 'card vertical large' + (this.state.selectedCardSize === 'large' ? ' selected' : '') } >
                                                <img className='card-image large vertical'
                                                    src='/img/cards/dynastycardback.jpg' />
                                            </div>
                                            <span className='bg-label'>Large</span>
                                        </div>
                                        <div className='card-settings' onClick={ () => this.onCardClick('x-large') }>
                                            <div className={ 'card vertical x-large' + (this.state.selectedCardSize === 'x-large' ? ' selected' : '') }>
                                                <img className='card-image x-large vertical'
                                                    src='img/cards/dynastycardback.jpg' />
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
