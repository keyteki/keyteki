import React from 'react';
import _ from 'underscore';
import $ from 'jquery';
import {connect} from 'react-redux';

import Link from './Link.jsx';
import AlertPanel from './SiteComponents/AlertPanel.jsx';

import * as actions from './actions';

class InnerLogin extends React.Component {
    constructor() {
        super();

        this.state = {
            error: '',
            username: '',
            password: '',
            validation: {}
        };

        this.onChange = this.onChange.bind(this);
        this.verifyUsername = this.verifyUsername.bind(this);
        this.verifyPassword = this.verifyPassword.bind(this);
        this.onLogin = this.onLogin.bind(this);
    }

    onChange(field, event) {
        var newState = {};

        newState[field] = event.target.value;
        this.setState(newState);
    }

    verifyUsername() {
        var validation = this.state.validation;

        delete validation['username'];

        if(!this.state.username || this.state.username === '') {
            validation['username'] = 'Please enter your username';
        }

        this.setState({ validation: validation });
    }

    verifyPassword() {
        var validation = this.state.validation;

        delete validation['password'];

        if(!this.state.password || this.state.password === '') {
            validation['password'] = 'Please enter your password';
        }

        this.setState({ validation: validation });
    }

    onLogin(event) {
        event.preventDefault();

        this.setState({ error: '' });

        this.verifyPassword();
        this.verifyUsername();

        if(_.any(this.state.validation, function(message) {
            return message && message !== '';
        })) {
            this.setState({ error: 'Please complete both fields and try again' });
            return;
        }

        $.ajax({
            url: '/api/account/login',
            type: 'POST',
            data: JSON.stringify({ username: this.state.username, password: this.state.password }),
            contentType: 'application/json'
        }).done((data) => {
            if(!data.success) {
                this.setState({ error: data.message });
                return;
            }

            this.props.login(data.user, data.token);
            if(this.props.socket) {
                this.props.socket.emit('authenticate', data.token);
            }

            this.props.navigate('/');
        }).fail((xhr) => {
            if(xhr.status === 401) {
                this.setState({ error: 'Invalid Username/password' });
            } else {
                this.setState({ error: 'Could not communicate with the server.  Please try again later.' });
            }
        });
    }

    render() {
        var fields = [
            {
                name: 'username',
                label: 'Username',
                placeholder: 'Username',
                inputType: 'text',
                blurCallback: this.verifyUsername
            },
            {
                name: 'password',
                label: 'Password',
                placeholder: 'Password',
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
                validation = <span className='help-block'>{ this.state.validation[field.name] }</span>;
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
                            value={ this.state[field.name] }
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
                            <Link href='/forgot' >Forgot your password?</Link>
                        </div>
                    </div>
                    <div className='form-group'>
                        <div className='col-sm-offset-2 col-sm-3'>
                            <button ref='submit' type='submit' className='btn btn-primary' onClick={ this.onLogin }>Login</button>
                        </div>
                    </div>
                </form>
            </div>);
    }
}

InnerLogin.displayName = 'Login';
InnerLogin.propTypes = {
    login: React.PropTypes.func,
    navigate: React.PropTypes.func,
    socket: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        socket: state.socket.socket
    };
}

const Login = connect(mapStateToProps, actions)(InnerLogin);

export default Login;
