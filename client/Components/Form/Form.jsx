import React from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';

import Input from './Input.jsx';
import Checkbox from './Checkbox.jsx';

import formFields from './formFields.json';

import { withTranslation } from 'react-i18next';

class Form extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        $.validator.unobtrusive.parse('form');

        this.validator = $('form').validate();
    }

    componentWillUnmount() {
        this.validator.destroy();
    }

    onChange(field, event) {
        var newState = {};

        newState[field] = event.target.value;
        this.setState(newState);
    }

    onCheckboxChange(field, event) {
        var newState = {};

        newState[field] = event.target.checked;
        this.setState(newState);
    }

    onSubmit(event) {
        event.preventDefault();

        if (!$('form').valid()) {
            return;
        }

        if (this.props.onSubmit) {
            this.props.onSubmit(this.state);
        }
    }

    translateValidationProps(field) {
        let t = this.props.t;
        let validationAttributes = {};

        if (field.validationProperties) {
            for (let key of Object.keys(field.validationProperties)) {
                if (
                    key === 'data-val-required' ||
                    key === 'data-val-length' ||
                    key === 'data-val-equalto' ||
                    key === 'data-val-regex'
                ) {
                    validationAttributes[key] = t(field.validationProperties[key]);
                } else {
                    validationAttributes[key] = field.validationProperties[key];
                }
            }
        }

        return validationAttributes;
    }

    render() {
        let t = this.props.t;

        const fieldsToRender = formFields[this.props.name].map((field) => {
            switch (field.inputType) {
                case 'checkbox':
                    return (
                        <Checkbox
                            key={field.name}
                            name={field.name}
                            label={t(field.label)}
                            fieldClass={field.fieldClass}
                            onChange={this.onCheckboxChange.bind(this, field.name)}
                            checked={this.state[field.name]}
                        />
                    );
                default:
                    return (
                        <Input
                            key={field.name}
                            name={field.name}
                            label={t(field.label)}
                            placeholder={t(field.placeholder)}
                            validationAttributes={this.translateValidationProps(field)}
                            fieldClass={field.fieldClass}
                            labelClass={field.labelClass}
                            type={field.inputType}
                            onChange={this.onChange.bind(this, field.name)}
                            value={this.state[field.name]}
                        />
                    );
            }
        });

        return (
            <form className='form form-horizontal' onSubmit={this.onSubmit}>
                {fieldsToRender}
                {this.props.children}
                <div className='form-group'>
                    <div className={this.props.buttonClass || 'col-sm-offset-4 col-sm-3'}>
                        <button
                            type='submit'
                            className='btn btn-primary'
                            disabled={this.props.apiLoading}
                        >
                            {t(this.props.buttonText) || t('Submit')}{' '}
                            {this.props.apiLoading ? (
                                <span className='spinner button-spinner' />
                            ) : null}
                        </button>
                    </div>
                </div>
            </form>
        );
    }
}

Form.displayName = 'Form';
Form.propTypes = {
    apiLoading: PropTypes.bool,
    buttonClass: PropTypes.string,
    buttonText: PropTypes.string,
    children: PropTypes.node,
    i18n: PropTypes.object,
    name: PropTypes.string.isRequired,
    onSubmit: PropTypes.func,
    t: PropTypes.func
};

export default withTranslation()(Form);
