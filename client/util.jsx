import React from 'react';

const urlSchemeRegex = /^(https?|ftp):\/\//i;

const isSafeUrl = (value) => {
    if (!urlSchemeRegex.test(value)) {
        return false;
    }

    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'ftp:';
    } catch (err) {
        return false;
    }
};

export function tryParseJSON(jsonString) {
    try {
        var retObject = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object",
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (retObject && typeof retObject === 'object') {
            return retObject;
        }
    } catch (e) {
        return false;
    }

    return false;
}

export function getMessageWithLinks(message) {
    let tokens = message.split(/\s/);

    let i = 0;
    let parts = tokens.map((token) => {
        if (isSafeUrl(token)) {
            return (
                <a key={`link-${i++}`} href={token} target='_blank' rel='noopener noreferrer'>
                    {token}
                </a>
            );
        }

        return token + ' ';
    });

    return parts;
}

export const getStandardControlProps = (formProps, controlName) => ({
    name: controlName,
    value: formProps.values[controlName],
    onChange: formProps.handleChange,
    onBlur: formProps.handleBlur,
    isInvalid: formProps.touched[controlName] && !!formProps.errors[controlName]
});

/**
 * @param {File} file
 * @returns {Promise<string>}
 */
export const toBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.toString().split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
