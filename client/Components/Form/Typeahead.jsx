import { Typeahead } from 'react-bootstrap-typeahead';
import React from 'react';
import PropTypes from 'prop-types';

class InternalTypeahead extends React.Component {
    clear() {
        this.typeahead.getInstance().clear();
    }

    render() {
        const label = this.props.label ? (
            <label htmlFor={this.props.name} className={this.props.labelClass + ' control-label'}>
                {this.props.label}
            </label>
        ) : null;
        const control = (
            <div>
                {label}
                <div className={this.props.fieldClass}>
                    <Typeahead
                        ref={(t) => (this.typeahead = t)}
                        options={this.props.options}
                        labelKey={this.props.labelKey}
                        emptyLabel={this.props.emptyLabel}
                        onChange={this.props.onChange}
                        placeholder={this.props.placeholder}
                        autoFocus={this.props.autoFocus}
                        dropup={this.props.dropup}
                        minLength={this.props.minLength}
                        onInputChange={this.props.onInputChange}
                        submitFormOnEnter={this.props.submitFormOnEnter}
                        onKeyDown={this.props.onKeyDown}
                        disabled={this.props.disabled}
                    />
                    {this.props.validationMessage ? (
                        <span className='help-block'>{this.props.validationMessage} </span>
                    ) : null}
                </div>
                {this.props.children}
            </div>
        );

        if (this.props.noGroup) {
            return control;
        }

        return <div className='form-group'>{control}</div>;
    }
}

InternalTypeahead.displayName = 'Typeahead';
InternalTypeahead.propTypes = {
    autoFocus: PropTypes.bool,
    children: PropTypes.object,
    disabled: PropTypes.bool,
    dropup: PropTypes.bool,
    emptyLabel: PropTypes.string,
    fieldClass: PropTypes.string,
    label: PropTypes.string,
    labelClass: PropTypes.string,
    labelKey: PropTypes.string,
    minLength: PropTypes.number,
    name: PropTypes.string,
    noGroup: PropTypes.bool,
    onChange: PropTypes.func,
    onInputChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    options: PropTypes.array,
    placeholder: PropTypes.string,
    submitFormOnEnter: PropTypes.bool,
    validationMessage: PropTypes.string,
    value: PropTypes.string
};

export default InternalTypeahead;
