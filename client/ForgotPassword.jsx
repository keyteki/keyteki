import React from 'react';
import _ from 'underscore';
import $ from 'jquery';
import {connect} from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';

import AlertPanel from './SiteComponents/AlertPanel.jsx';

import * as actions from './actions';

class InnerForgotPassword extends React.Component {
    constructor() {
        super();

        this.state = {
            error: '',
            username: '',
            password: '',
            captcha: '',
            validation: {}
        };

        this.onChange = this.onChange.bind(this);
        this.verifyUsername = this.verifyUsername.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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

    onCaptchaChange(value) {
        this.setState({ captcha: value });
    }

    onSubmit(event) {
        event.preventDefault();

        this.setState({ error: '' });

        this.verifyUsername();

        if(_.any(this.state.validation, function(message) {
            return message && message !== '';
        })) {
            this.setState({ error: 'Please complete the fields and try again' });
            return;
        }

        this.setState({ submitting: true });

        $.ajax({
            url: '/api/account/password-reset',
            type: 'POST',
            data: JSON.stringify({ username: this.state.username, captcha: this.state.captcha }),
            contentType: 'application/json'
        }).done((data) => {
            this.setState({ submitting: false });

            if(!data.success) {
                this.setState({ error: data.message });
                return;
            }

            this.setState({ success: 'Your request was submitted, if you have an account, an email will have been sent to the address you used to register with more instructions. This request could end up in your Spam folder, so make sure to check there if you do not see it.' });
        }).fail(() => {
            this.setState({ submitting: false });

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
                blurCallback: this.verifyUsername
            }
        ];

        var fieldsToRender = [];
        var errorBar = this.state.error ? <div className='alert alert-danger' role='alert'>{ this.state.error }</div> : null;
        var successBar = this.state.success ? <div className='alert alert-success' role='alert'>{ this.state.success }</div> : null;

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
                    <div className='col-sm-6'>
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

        if(this.state.success) {
            return <div>{ successBar }</div>;
        }

        return (
            <div>
                { errorBar }
                <AlertPanel type='info' message='To start the password recovery process, please enter your username and click the submit button.' />
                <div className='col-sm-6 col-sm-offset-3'>
                    <div className='panel-title'>
                    Forgot password
                    </div>
                    <div className='panel'>
                        <form className='form form-horizontal'>
                            { fieldsToRender }
                            <div className='form-group'>
                                <div className='col-sm-offset-2 col-sm-3'>
                                    <ReCAPTCHA ref='recaptcha' sitekey='6LdioDEUAAAAAH1lkMBCcE7mW3vRudleb9weuT8U' theme='dark' onChange={ this.onCaptchaChange.bind(this) } />
                                </div>
                            </div>
                            <div className='form-group'>
                                <div className='col-sm-offset-2 col-sm-3'>
                                    { this.state.submitting ? <button type='submit' className='btn btn-primary' disabled>Submitting...</button> :
                                        <button ref='submit' type='submit' className='btn btn-primary' onClick={ this.onSubmit }>Submit</button>
                                    }
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>);
    }
}

InnerForgotPassword.displayName = 'ForgotPassword';
InnerForgotPassword.propTypes = {
    login: React.PropTypes.func,
    navigate: React.PropTypes.func,
    socket: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        socket: state.socket.socket
    };
}

const ForgotPassword = connect(mapStateToProps, actions)(InnerForgotPassword);

export default ForgotPassword;
