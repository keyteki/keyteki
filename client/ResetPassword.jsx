import React from 'react';
import _ from 'underscore';
import $ from 'jquery';

import {connect} from 'react-redux';
import AlertPanel from './SiteComponents/AlertPanel.jsx';

import * as actions from './actions';

class InnerResetPassword extends React.Component {
    constructor() {
        super();

        this.state = {
            password: '',
            password1: '',
            validation: {}
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    verifyPassword(isSubmitting) {
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

    onSubmit(event) {
        event.preventDefault();

        this.setState({ error: '' });

        this.verifyPassword(true);

        if(_.any(this.state.validation, function(message) {
            return message && message !== '';
        })) {
            this.setState({ error: 'There was an error in one or more fields, please see below, correct the error and try again' });
            return;
        }

        $.ajax({
            url: '/api/account/password-reset-finish',
            type: 'POST',
            data: JSON.stringify({ id: this.props.id, token: this.props.token, newPassword: this.state.password }),
            contentType: 'application/json'
        }).done((data) => {
            if(!data.success) {
                this.setState({ error: data.message });
                return;
            }

            this.props.navigate('/login');
        }).fail(() => {
            this.setState({ error: 'Could not communicate with the server.  Please try again later.' });
        });
    }

    render() {
        if(!this.props.id || !this.props.token) {
            return <AlertPanel type='error' message='This page is not intended to be viewed directly.  Please click on the link in your email to reset your password' />;
        }

        var fields = [
            {
                name: 'password',
                label: 'New Password',
                placeholder: 'Password',
                inputType: 'password',
                blurCallback: () => this.verifyPassword(false)
            },
            {
                name: 'password1',
                label: 'New Password (again)',
                placeholder: 'Password (again)',
                inputType: 'password',
                blurCallback: () => this.verifyPassword(false)
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
                            <button ref='submit' type='submit' className='btn btn-primary' onClick={ this.onSubmit }>Submit</button>
                        </div>
                    </div>
                </form>
            </div>);
    }
}

InnerResetPassword.propTypes = {
    id: React.PropTypes.string,
    navigate: React.PropTypes.func,
    token: React.PropTypes.string
};
InnerResetPassword.displayName = 'ResetPassword';

function mapStateToProps() {
    return {
    };
}

const ResetPassword = connect(mapStateToProps, actions)(InnerResetPassword);

export default ResetPassword;
