import React from 'react';
import $ from 'jquery';
import _ from 'underscore';
import {connect} from 'react-redux';

import AlertPanel from './SiteComponents/AlertPanel.jsx';
import * as actions from './actions';

export class InnerRegister extends React.Component {
    constructor() {
        super();

        this.onRegister = this.onRegister.bind(this);
        this.onChange = this.onChange.bind(this);
        this.verifyUsername = this.verifyUsername.bind(this);
        this.verifyEmail = this.verifyEmail.bind(this);
        this.verifyPassword = this.verifyPassword.bind(this);

        this.state = {
            username: '',
            email: '',
            password: '',
            password1: '',
            validation: {}
        };
    }

    verifyUsername(event, isSubmitting) {
        var validation = this.state.validation;

        delete validation['username'];

        if(this.state.username.length < 3 || this.state.username.length > 15) {
            validation['username'] = 'Username must be between 3 and 15 characters long';
        }

        if(!/^[A-Z0-9_-]+$/i.test(this.state.username)) {
            validation['username'] = 'Usernames must only use the characters a-z, 0-9, _ and -';
        }

        if(isSubmitting) {
            this.setState({ validation: validation });
            return;
        }

        $.post('/api/account/check-username', { username: this.state.username })
            .done((data) => {
                if(data.message) {
                    validation['username'] = data.message;
                }
            })
            .always(() => {
                this.setState({ validation: validation });
            });
    }

    verifyEmail() {
        var validation = this.state.validation;

        delete validation['email'];

        if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(this.state.email)) {
            validation['email'] = 'Please enter a valid email address';
        }

        this.setState({ validation: validation });
    }

    verifyPassword(event, isSubmitting) {
        var validation = this.state.validation;

        delete validation['password'];

        if(this.state.password.length < 6) {
            validation['password'] = 'The password you specify must be at least 6 characters long';
        }

        if(isSubmitting && !this.state.password1) {
            validation['password'] = 'Please enter your password again';
        }

        if(this.state.password && this.state.password1 && this.state.password !== this.state.password1) {
            validation['password'] = 'The passwords you have specified do not match';
        }

        this.setState({ validation: validation });
    }

    onChange(field, event) {
        var newState = {};

        newState[field] = event.target.value;
        this.setState(newState);
    }

    onRegister(event) {
        event.preventDefault();

        this.setState({ error: '' });

        this.verifyEmail();
        this.verifyPassword({}, true);
        this.verifyUsername({}, true);

        if(_.any(this.state.validation, function(message) {
            return message && message !== '';
        })) {
            this.setState({ error: 'There was an error in one or more fields, please see below, correct the error and try again' });
            return;
        }

        $.ajax({
            url: '/api/account/register',
            type: 'POST',
            data: JSON.stringify({ username: this.state.username, password: this.state.password, email: this.state.email }),
            contentType: 'application/json'
        }).done((data) => {
            if(!data.success) {
                this.setState({ error: data.message });
                return;
            }

            this.props.register(data.user, data.token);
            this.props.socket.emit('authenticate', data.token);
            this.props.navigate('/');
        }).fail(() => {
            this.setState({ error: 'Could not communicate with the server.  Please try again later.' });
        });
    }

    render() {
        var fields = [
            {
                name: 'username',
                label: 'Username',
                placeholder: 'Username',
                inputType: 'text',
                blurCallback: (event) => this.verifyUsername(event, false)
            },
            {
                name: 'email',
                label: 'email Address',
                placeholder: 'email Address',
                inputType: 'email',
                blurCallback: this.verifyEmail
            },
            {
                name: 'password',
                label: 'Password',
                placeholder: 'Password',
                inputType: 'password',
                blurCallback: this.verifyPassword
            },
            {
                name: 'password1',
                label: 'Password (again)',
                placeholder: 'Password (again)',
                inputType: 'password',
                blurCallback: this.verifyPassword
            }
        ];
        var fieldsToRender = [];
        var errorBar = this.state.error ? <AlertPanel type='error' message={ this.state.error } /> : null;

        _.each(fields, (field) => {
            var className = 'form-group';
            var validation = null;

            if(this.state.validation[field.name]) {
                className += ' has-error';
                validation = <span className='help-block'>{ this.state.validation[field.name]}</span>;
            }

            fieldsToRender.push(
                <div key={ field.name } className={ className }>
                    <label htmlFor={ field.name } className='col-sm-2 control-label'>{ field.label }</label>
                    <div className='col-sm-3'>
                        <input type={ field.inputType }
                            ref={ field.name }
                            className='form-control'
                            id={ field.name }
                            placeholder={ field.placeholder }
                            value={ this.state[field.name]}
                            onChange={ this.onChange.bind(this, field.name) }
                            onBlur={ field.blurCallback } />
                        { validation }
                    </div>
                </div>);
        });

        return (
            <div>
                { errorBar }
                <form className='form form-horizontal'>
                    { fieldsToRender }
                    <div className='form-group'>
                        <div className='col-sm-offset-2 col-sm-3'>
                            <button ref='submit' type='submit' className='btn btn-primary' onClick={ this.onRegister }>Register</button>
                        </div>
                    </div>
                </form>
            </div>);
    }
}

InnerRegister.displayName = 'Register';
InnerRegister.propTypes = {
    navigate: React.PropTypes.func,
    register: React.PropTypes.func,
    socket: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        socket: state.socket.socket
    };
}

const Register = connect(mapStateToProps, actions)(InnerRegister);

export default Register;
