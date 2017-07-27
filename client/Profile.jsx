import React from 'react';
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

        this.windowDefaults = {
            plot: false,
            draw: false,
            challengeBegin: false,
            attackersDeclared: true,
            defendersDeclared: true,
            winnerDetermined: false,
            dominance: false,
            standing: false
        };

        this.state = {
            disableGravatar: this.props.user.settings ? this.props.user.settings.disableGravatar : false,
            email: this.props.user ? this.props.user.email : '',
            loading: false,
            newPassword: '',
            newPasswordAgain: '',
            promptedActionWindows: this.props.user ? this.props.user.promptedActionWindows || this.windowDefaults : this.windowDefaults,
            validation: {},
            windowTimer: this.props.user.settings ? _.isUndefined(this.props.user.settings.windowTimer) ? 10 : this.props.user.settings.windowTimer : 10
        };

        this.windows = [
            { name: 'plot', label: 'Plots revealed', style: 'col-sm-4' },
            { name: 'draw', label: 'Draw phase', style: 'col-sm-4' },
            { name: 'challengeBegin', label: 'Challenge phase begins', style: 'col-sm-4' },
            { name: 'attackersDeclared', label: 'Attackers declared', style: 'col-sm-4' },
            { name: 'defendersDeclared', label: 'Defenders declared', style: 'col-sm-4' },
            { name: 'winnerDetermined', label: 'Winner determined', style: 'col-sm-4' },
            { name: 'dominance', label: 'Dominance phase', style: 'col-sm-4' },
            { name: 'standing', label: 'Standing phase', style: 'col-sm-4' }
        ];
    }

    componentWillReceiveProps(props) {
        if(!props.user) {
            return;
        }

        this.setState({
            email: props.user.email,
            disableGravatar: props.user.settings ? props.user.settings.disableGravatar : false,
            promptedActionWindows: props.user ? props.user.promptedActionWindows || this.windowDefaults : this.windowDefaults
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
                            windowTimer: this.state.windowTimer
                        }
                    })
                }
            })
            .done((data) => {
                if(data.success) {
                    this.setState({ successMessage: 'Profile saved successfully' });

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
            <div>
                <h3 className='text-center'>Profile for { this.props.user.username }</h3>
                { this.state.errorMessage ? <AlertPanel type='error' message={ this.state.errorMessage } /> : null }
                { this.state.successMessage ? <AlertPanel type='success' message={ this.state.successMessage } /> : null }
                <form className='form form-horizontal'>
                    <div className='row'>
                        <div className='col-sm-8 col-sm-offset-2'>
                            <div className='panel-title text-center'>
                                User
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
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-sm-offset-2 col-sm-8'>
                            <div className='panel-title text-center'>
                                Action window defaults
                            </div>
                            <div className='panel'>
                                <p className='help-block small'>If an option is selected here, you will always be prompted if you want to take an action in that window.  If an option is not selected, you will receive no prompts for that window.  For some windows (e.g. dominance) this could mean the whole window is skipped</p>
                                <div className='form-group'>
                                    { windows }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-sm-offset-2 col-sm-8'>
                            <div className='panel-title text-center'>
                                Action window timing
                            </div>
                            <div className='panel'>
                                <p className='help-block small'>Every time a game event occurs after which you could possibly have an action, reaction or interrupt which would allow you to cancel it, a timer will count down.  At the end of that timer, the window will automatically pass.  This options controls how fast that timer counts down</p>
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
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-offset-8 col-sm-2'>
                        <button className='btn btn-primary' type='button' disabled={ this.state.loading } onClick={ this.onSaveClick.bind(this) }>Save</button>
                    </div>
                </form>
            </div>);
    }
}

InnerProfile.displayName = 'Profile';
InnerProfile.propTypes = {
    refreshUser: React.PropTypes.func,
    socket: React.PropTypes.object,
    user: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        socket: state.socket.socket,
        user: state.auth.user
    };
}

const Profile = connect(mapStateToProps, actions)(InnerProfile);

export default Profile;
