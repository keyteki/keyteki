import { Typeahead } from 'react-bootstrap-typeahead';
import React, { useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';

const InternalTypeahead = React.forwardRef((props, ref) => {
    const typeaheadRef = useRef(null);

    useImperativeHandle(ref, () => ({
        clear: () => {
            if (typeaheadRef.current?.clear) {
                typeaheadRef.current.clear();
                return;
            }

            typeaheadRef.current?.getInstance?.()?.clear?.();
        }
    }));

    const label = props.label ? (
        <label htmlFor={props.name} className={`${props.labelClass} control-label`}>
            {props.label}
        </label>
    ) : null;
    const control = (
        <div>
            {label}
            <div className={props.fieldClass}>
                <Typeahead
                    ref={typeaheadRef}
                    id={props.id || props.name}
                    options={props.options}
                    labelKey={props.labelKey}
                    emptyLabel={props.emptyLabel}
                    onChange={props.onChange}
                    placeholder={props.placeholder}
                    autoFocus={props.autoFocus}
                    dropup={props.dropup}
                    minLength={props.minLength}
                    onInputChange={props.onInputChange}
                    submitFormOnEnter={props.submitFormOnEnter}
                    onKeyDown={props.onKeyDown}
                    disabled={props.disabled}
                />
                {props.validationMessage ? (
                    <span className='help-block'>{props.validationMessage} </span>
                ) : null}
            </div>
            {props.children}
        </div>
    );

    if (props.noGroup) {
        return control;
    }

    return <div className='form-group'>{control}</div>;
});

InternalTypeahead.displayName = 'Typeahead';
InternalTypeahead.propTypes = {
    autoFocus: PropTypes.bool,
    children: PropTypes.object,
    disabled: PropTypes.bool,
    dropup: PropTypes.bool,
    emptyLabel: PropTypes.string,
    fieldClass: PropTypes.string,
    id: PropTypes.string,
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
