import React from 'react';
import { useTranslation } from 'react-i18next';
import AbilityTargeting from './AbilityTargeting';
import CardNameLookup from './CardNameLookup';
import TraitNameLookup from './TraitNameLookup';
import HouseSelect from './HouseSelect';
import OptionsSelect from './OptionsSelect';
import Panel from '../Site/Panel';

import './ActivePlayerPrompt.scss';
import CardImage from './CardImage';

/**
 * @typedef ActivePlayerPromptProps
 * @property {string} phase current game phase displayed as the prompt header
 * @property {string|Object} promptTitle a string or a localization object to show as prompt title
 * @property {string|Object} promptText a string or a localization object to show as prompt text
 * @property {Object[]} buttons array of buttons
 * @property {Object[]} cards array of cards
 * @property {Object[]} controls array of controls
 * @property {function(Object): void} onButtonClick Called when a button is pressed
 * @property {function(Object): void} onMouseOut Called when mouse is moved out of a card image
 * @property {function(Object): void} onMouseOver Called when mouse is moved over of a card image
 */

/**
 * @param {ActivePlayerPromptProps} props
 */
const ActivePlayerPrompt = (props) => {
    const MaxButtonTextLength = 28;
    const { t, i18n } = useTranslation();

    const onButtonClick = (event, command, arg, uuid, method) => {
        event.preventDefault();

        if (props.onButtonClick) {
            props.onButtonClick(command, arg, uuid, method);
        }
    };

    const onMouseOver = (card) => {
        if (card && props.onMouseOver) {
            props.onMouseOver(card);
        }
    };

    const onMouseOut = (card) => {
        if (card && props.onMouseOut) {
            props.onMouseOut(card);
        }
    };

    const localizedText = (source, text, values) => {
        if (!isNaN(text)) {
            // text is just a plain number, avoid translation
            return text;
        }

        if (!text) {
            return '';
        }

        if (i18n.language !== 'en') {
            // Avoid locale replacement if language is English

            if (!source || !source.locale || !source.locale[i18n.language]) {
                // If no source or source does not have locale, simply do the translation
                return t(text, values);
            }

            if (values && values.card) {
                // if there is a {{card}} property in the values, we should use localized source name
                values.card = source.locale[i18n.language].name;
                return t(text, values);
            }

            if (!values) {
                // if no values, add a 'card' with localized source name and try to find, worst case, the source name
                // in the text and replace it for i18n interpolation
                values = { card: source.locale[i18n.language].name };
                while (text.includes(source.name)) {
                    text = text.replace(source.name, '{{card}}');
                }
            }
        }

        return t(text, values);
    };

    const getButtons = () => {
        let buttonIndex = 0;

        let buttons = [];

        if (
            !props.buttons ||
            props.controls.some((c) => ['house-select', 'options-select'].includes(c.type))
        ) {
            return null;
        }

        for (const button of props.buttons) {
            const originalButtonText = localizedText(button.card, button.text, button.values);
            let buttonText = originalButtonText;

            if (buttonText.length > MaxButtonTextLength) {
                buttonText = buttonText.slice(0, MaxButtonTextLength - 3).trim() + '...';
            }

            let option = (
                <button
                    key={button.command + buttonIndex.toString()}
                    className='btn btn-default prompt-button btn-stretch'
                    title={originalButtonText}
                    onClick={(event) =>
                        onButtonClick(event, button.command, button.arg, button.uuid, button.method)
                    }
                    onMouseOver={(event) =>
                        onMouseOver(event, {
                            image: button.card ? <CardImage card={button.card} /> : null,
                            size: 'normal'
                        })
                    }
                    onMouseOut={(event) => onMouseOut(event, button.card)}
                    disabled={button.disabled}
                >
                    {buttonText}{' '}
                    {button.icon && <div className={`button-icon icon-${button.icon}`} />}
                </button>
            );

            buttonIndex++;

            buttons.push(option);
        }

        return buttons;
    };

    const onControlSelected = (command, uuid, method, value) => {
        if (props.onButtonClick) {
            props.onButtonClick(command, value, uuid, method);
        }
    };

    const onOptionSelected = (option) => {
        if (props.onButtonClick) {
            let button = props.buttons.find((button) => '' + button.arg === option);
            props.onButtonClick(button.command, button.arg, button.uuid, button.method);
        }
    };

    const getControls = () => {
        if (!props.controls) {
            return null;
        }

        return props.controls.map((control) => {
            switch (control.type) {
                case 'targeting':
                    return (
                        <AbilityTargeting
                            onMouseOut={props.onMouseOut}
                            onMouseOver={props.onMouseOver}
                            source={control.source}
                            targets={control.targets}
                        />
                    );
                case 'card-name':
                    return (
                        <CardNameLookup
                            cards={props.cards}
                            onCardSelected={(cardName) =>
                                onControlSelected(
                                    control.command,
                                    control.uuid,
                                    control.method,
                                    cardName
                                )
                            }
                        />
                    );
                case 'trait-name':
                    return (
                        <TraitNameLookup
                            cards={props.cards}
                            onValueSelected={(trait) =>
                                onControlSelected(
                                    control.command,
                                    control.uuid,
                                    control.method,
                                    trait
                                )
                            }
                        />
                    );
                case 'house-select':
                    return (
                        <HouseSelect buttons={props.buttons} onHouseSelected={onControlSelected} />
                    );
                case 'options-select':
                    return (
                        <OptionsSelect
                            options={props.buttons}
                            onOptionSelected={onOptionSelected}
                        />
                    );
            }
        });
    };

    const safePromptText = (promptObject) => {
        if (promptObject) {
            return typeof promptObject === 'string' ? promptObject : promptObject.text;
        }

        return null;
    };

    let controlSource = null;
    if (props.controls && props.controls.length > 0 && props.controls[0].source) {
        controlSource = props.controls[0].source;
    }

    let promptTitle;

    if (props.promptTitle) {
        let promptTitleText = safePromptText(props.promptTitle);

        promptTitle = (
            <div className='menu-pane-source'>
                {localizedText(controlSource, promptTitleText, props.promptTitle.values)}
            </div>
        );
    }

    let timer = null;
    let promptText = safePromptText(props.promptText);
    let promptTexts = [];

    if (promptText) {
        if (promptText.includes('\n')) {
            let split = promptText.split('\n');
            for (let token of split) {
                promptTexts.push(localizedText(controlSource, token, props.promptText.values));
                promptTexts.push(<br />);
            }
        } else {
            promptTexts.push(localizedText(controlSource, promptText, props.promptText.values));
        }
    }

    return (
        <Panel title={t(props.phase + ' phase')} titleClass='phase-indicator'>
            {timer}
            {promptTitle}
            <div className='menu-pane'>
                <h4>{promptTexts}</h4>
                {getControls()}
                {getButtons()}
            </div>
        </Panel>
    );
};

ActivePlayerPrompt.displayName = 'ActivePlayerPrompt';
export default ActivePlayerPrompt;
