import React from 'react';

class Register extends React.Component {
    constructor() {
        super();

        this.onRegister = this.onRegister.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            username: '',
            email: '',
            password: '',
            password1: ''
        };
    }

    onChange(field, event) {
        var newState = {};

        newState[field] = event.target.value;
        this.setState(newState);
    }

    onRegister(event) {
        event.preventDefault();
    }

    render() {
        return (
            <form className='form form-horizontal'>
                <div className='form-group'>
                    <label htmlFor='username' className='col-sm-2 control-label'>Username</label>
                    <div className='col-sm-4'>
                        <input type='text'
                            className='form-control'
                            id='username'
                            placeholder='Username'
                            value={ this.state.username }
                            onChange={ this.onChange.bind(this, 'username') } />
                    </div>
                </div>
                <div className='form-group'>
                    <label htmlFor='email' className='col-sm-2 control-label'>E-Mail Address</label>
                    <div className='col-sm-4'>
                        <input type='email'
                            className='form-control'
                            id='email'
                            placeholder='E-Mail Address'
                            value={ this.state.email }
                            onChange={ this.onChange.bind(this, 'email') }
                            />
                    </div>
                </div>
                <div className='form-group'>
                    <label htmlFor='password' className='col-sm-2 control-label'>Password</label>
                    <div className='col-sm-4'>
                        <input type='password'
                            className='form-control'
                            id='password'
                            placeholder='Password'
                            value={ this.state.password }
                            onChange={ this.onChange.bind(this, 'password') }
                            />
                    </div>
                </div>
                <div className='form-group'>
                    <label htmlFor='password1' className='col-sm-2 control-label'>Password (again) </label>
                    <div className='col-sm-4'>
                        <input type='password'
                            className='form-control'
                            id='password1'
                            placeholder='Password (again)'
                            value={ this.state.password1 }
                            onChange={ this.onChange.bind(this, 'password1') } />
                    </div>
                </div>
                <div className='form-group'>
                    <div className='col-sm-offset-2 col-sm-4'>
                        <button type='submit' className='btn btn-primary' onClick={ this.onRegister }>Register</button>
                    </div>
                </div>
            </form>);
    }
}

Register.displayName = 'Register';

export default Register;
