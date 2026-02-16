import React, { useState } from 'react';
import { Button } from '@heroui/react';
import { Trans } from 'react-i18next';

/**
 * @typedef ConfirmedButtonProps
 * @property {import('react').ReactNode | import('react').ReactNodeArray} [children]
 * @property {() => void} onClick
 */

/**
 * @param {ConfirmedButtonProps} props
 */
const ConfirmButton = ({ children, onClick }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [btnText, setBtnText] = useState(children);

    const handleClick = (event) => {
        event.preventDefault();
        setShowConfirm(!showConfirm);

        if (showConfirm) {
            setBtnText(children);
        } else {
            setBtnText(<Trans>Cancel</Trans>);
        }
    };

    const handleConfirmClick = (event) => {
        event.preventDefault();
        onClick();
        setBtnText(children);
        setShowConfirm(false);
    };

    return (
        <>
            <Button size='sm' variant='tertiary' onPress={handleClick}>
                {btnText}
            </Button>
            {showConfirm ? (
                <Button size='sm' variant='danger' onPress={handleConfirmClick}>
                    <Trans>Confirm</Trans>
                </Button>
            ) : null}
        </>
    );
};

export default ConfirmButton;
