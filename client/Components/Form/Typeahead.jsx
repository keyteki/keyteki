import React, { useImperativeHandle, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const InternalTypeahead = React.forwardRef((props, ref) => {
    const inputRef = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const dataListId = props.id || props.name || 'typeahead';

    const normalizedOptions = useMemo(() => {
        return (props.options || []).map((option) => {
            if (typeof option === 'string') {
                return { label: option, value: option, raw: option };
            }

            const label = option?.[props.labelKey] ?? option?.label ?? option?.value ?? '';
            const value = option?.value ?? label;

            return { label, value, raw: option };
        });
    }, [props.labelKey, props.options]);

    const emitSelection = (value) => {
        const selected = normalizedOptions.find((option) => option.label === value);

        if (props.onChange) {
            props.onChange(selected ? [selected.raw] : []);
        }
    };

    useImperativeHandle(ref, () => ({
        clear: () => {
            setInputValue('');
            if (inputRef.current) {
                inputRef.current.value = '';
            }
            props.onChange?.([]);
        }
    }));

    const label = props.label ? (
        <label
            htmlFor={dataListId}
            className={props.labelClass || 'mb-1 block text-sm text-zinc-200'}
        >
            {props.label}
        </label>
    ) : null;

    const control = (
        <div>
            {label}
            <div className={props.fieldClass}>
                <input
                    ref={inputRef}
                    id={dataListId}
                    list={`${dataListId}-list`}
                    placeholder={props.placeholder}
                    autoFocus={props.autoFocus}
                    disabled={props.disabled}
                    value={inputValue}
                    onChange={(event) => {
                        const value = event.target.value;
                        setInputValue(value);
                        props.onInputChange?.(value);
                        emitSelection(value);
                    }}
                    onKeyDown={props.onKeyDown}
                    className='w-full rounded-md border border-zinc-600/70 bg-black/80 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-400 focus:border-zinc-400/80 focus:outline-none'
                />
                <datalist id={`${dataListId}-list`}>
                    {normalizedOptions
                        .filter((option) =>
                            inputValue.length >= (props.minLength || 0)
                                ? option.label.toLowerCase().includes(inputValue.toLowerCase())
                                : false
                        )
                        .map((option) => (
                            <option key={option.value} value={option.label} />
                        ))}
                </datalist>
                {props.validationMessage ? (
                    <span className='mt-1 block text-xs text-red-300'>
                        {props.validationMessage}
                    </span>
                ) : null}
            </div>
            {props.children}
        </div>
    );

    if (props.noGroup) {
        return control;
    }

    return <div className='mb-2'>{control}</div>;
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
