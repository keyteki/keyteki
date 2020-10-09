import React, { useRef } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import Panel from '../Site/Panel';
import './ProfileBackground.scss';
import { useState } from 'react';

/**
 * @typedef BackgroundOption
 * @property {string} name The name stored in the database
 * @property {string} label The label displayed to the user
 * @property {string} imageUrl The URL of the image for this background
 */

/**
 * @typedef BackgroundProps
 * @property {BackgroundOption[]} backgrounds The list of available backgrounds
 * @property {string} selectedBackground The currently selected background
 * @property {function(string, File): void} onBackgroundSelected Called when a background is selected
 */

/**
 * @param {BackgroundProps} props
 */
const ProfileBackground = ({
    backgrounds,
    selectedBackground,
    customBackground,
    onBackgroundSelected
}) => {
    const { t } = useTranslation();
    const uploadRef = useRef();
    const [localCustomBg, setCustomBg] = useState(
        customBackground ? `/img/bgs/${customBackground}.png` : null
    );
    const [fileError, setFileError] = useState(null);

    return (
        <Panel title={t('Game Board Background')}>
            <Row>
                {backgrounds.map((background) => (
                    <Col
                        sm={4}
                        onClick={() => onBackgroundSelected(background.name, null)}
                        key={background.name}
                    >
                        <img
                            className={classNames('img-fluid', {
                                selected: selectedBackground === background.name
                            })}
                            src={background.imageUrl}
                        />
                        <span className='bg-label'>{background.label}</span>
                    </Col>
                ))}
                <Col sm={4}>
                    <img
                        className={classNames('img-fluid custom-bg', {
                            selected: selectedBackground === 'custom'
                        })}
                        src={localCustomBg}
                        onClick={() => uploadRef.current?.click()}
                    />
                    <Form.Control
                        name='avatar'
                        type='file'
                        accept='image/*'
                        hidden
                        onChange={(event) => {
                            if (
                                !event.currentTarget ||
                                !event.currentTarget.files ||
                                event.currentTarget.files.length === 0
                            ) {
                                return;
                            }

                            const file = event.currentTarget.files[0];

                            if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
                                setFileError('File must be an image');
                                setCustomBg(null);
                            } else if (file.size / 1024 / 1024 > 5) {
                                setFileError('File must be less than 5MB');
                                setCustomBg(null);
                            } else {
                                setCustomBg(URL.createObjectURL(file));
                                onBackgroundSelected('custom', file);
                                setFileError(false);
                            }
                        }}
                        ref={uploadRef}
                    ></Form.Control>
                    {fileError && <span className='text-danger bg-error'>{fileError}</span>}
                    <span className='bg-label'>Custom</span>
                </Col>
            </Row>
        </Panel>
    );
};

export default ProfileBackground;
