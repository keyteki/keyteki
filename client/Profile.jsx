import React from 'react';
import _ from 'underscore';
import $ from 'jquery';
import {connect} from 'react-redux';

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
            promptedActionWindows: this.props.user.promptedActionWindows || this.windowDefaults,
            validation: {}
        };

        this.windows = [
            { name: 'plot', label: 'Plots revealed' },
            { name: 'draw', label: 'Draw phase' },
            { name: 'challengeBegin', label: 'Challenge phase begins' },
            { name: 'attackersDeclared', label: 'Attackers declared' },
            { name: 'defendersDeclared', label: 'Defenders declared' },
            { name: 'winnerDetermined', label: 'Winner determined' },
            { name: 'dominance', label: 'Dominance phase' },
            { name: 'standing', label: 'Standing phase' }
        ];
    }

    componentWillReceiveProps(props) {
        if(!props.user) {
            return;
        }
        
        this.setState({ email: props.user.email, disableGravatar: props.user.settings ? props.user.settings.disableGravatar : false, promptedActionWindows: props.user.promptedActionWindows || this.windowDefaults });
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
                data: { data: JSON.stringify({
                    email: this.state.email,
                    password: this.state.newPassword,
                    promptedActionWindows: this.state.promptedActionWindows,
                    settings : {
                        disableGravatar: this.state.disableGravatar
                    }
                }) }
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

    render() {
        if(!this.props.user) {
            return <AlertPanel type='error' message='You must be logged in to update your profile' />;
        }

        let windows = _.map(this.windows, window => {
            return (<Checkbox key={ window.name } name={ 'promptedActionWindows.' + window.name } label={ window.label } fieldClass='col-sm-offset-3 col-sm-4'
                type='checkbox' onChange={ (this.onWindowToggle.bind(this, window.name)) } checked={ this.state.promptedActionWindows[window.name] } />);             
        });

        return (
            <div>
                <h2>User profile for { this.props.user.username }</h2>
                { this.state.errorMessage ? <AlertPanel type='error' message={ this.state.errorMessage } /> : null }
                { this.state.successMessage ? <AlertPanel type='success' message={ this.state.successMessage } /> : null }
                <form className='form form-horizontal'>
                    <h3>User details</h3>
                    <Input name='email' label='Email Address' labelClass='col-sm-3' fieldClass='col-sm-4' placeholder='Enter email address'
                        type='text' onChange={ this.onChange.bind(this, 'email') } value={ this.state.email }
                        onBlur={ this.verifyEmail.bind(this) } validationMessage={ this.state.validation['email'] } />
                    <Input name='newPassword' label='New Password' labelClass='col-sm-3' fieldClass='col-sm-4' placeholder='Enter new password'
                        type='password' onChange={ this.onChange.bind(this, 'newPassword') } value={ this.state.newPassword } 
                        onBlur={ this.verifyPassword.bind(this, false) } validationMessage={ this.state.validation['password'] } />
                    <Input name='newPasswordAgain' label='New Password (again)' labelClass='col-sm-3' fieldClass='col-sm-4' placeholder='Enter new password (again)'
                        type='password' onChange={ this.onChange.bind(this, 'newPasswordAgain') } value={ this.state.newPasswordAgain } 
                        onBlur={ this.verifyPassword.bind(this, false) } validationMessage={ this.state.validation['password1'] } />
                    <Checkbox name='disableGravatar' label='Disable Gravatar integration' fieldClass='col-sm-offset-3 col-sm-4'
                        onChange={ e => this.setState({ disableGravatar: e.target.checked }) } checked={ this.state.disableGravatar } />
                    <h3>Action window defaults</h3>
                    { windows }

                    <button className='btn btn-primary' type='button' disabled={ this.state.loading } onClick={ this.onSaveClick.bind(this) }>Save</button>
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
