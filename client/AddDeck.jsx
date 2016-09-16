import React from 'react';
import { withRouter } from 'react-router';
import _ from 'underscore';

class AddDeck extends React.Component {
    constructor() {
        super();

        this.state = {
            error: '',
            deckname: '',
            validation: {
                deckname: ''
            }
        };

        this.verifyDeckname = this.verifyDeckname.bind(this);
    }

    componentWillMount() {
    }

    verifyDeckname() {
    }

    onChange(field, event) {
        var newState = {};

        newState[field] = event.target.value;
        this.setState(newState);
    }

    render() {
        var fields = [
            {
                name: 'deckname',
                label: 'Deck Name',
                placeholder: 'Deck Name',
                inputType: 'text',
                blurCallback: this.verifyDeckname
            },
        ];

        var fieldsToRender = [];
        var errorBar = this.state.error ? <div className='alert alert-danger' role='alert'>{ this.state.error }</div> : null;

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
                            <button ref='submit' type='submit' className='btn btn-primary' onClick={ this.onAddDeck }>Add Deck</button>
                        </div>
                    </div>
                </form>
            </div>);
    }
}

AddDeck.displayName = 'AddDeck';
AddDeck.propTypes = {
    router: React.PropTypes.shape({
        push: React.PropTypes.func.isRequired
    }).isRequired
};

export default withRouter(AddDeck, { withRef: true });
