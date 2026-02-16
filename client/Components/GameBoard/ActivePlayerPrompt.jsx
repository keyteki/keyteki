import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@heroui/react';
import AbilityTargeting from './AbilityTargeting';
import CardNameLookup from './CardNameLookup';
import TraitNameLookup from './TraitNameLookup';
import HouseSelect from './HouseSelect';
import OptionsSelect from './OptionsSelect';
import Panel from '../Site/Panel';

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
    const { t, i18n } = useTranslation();
    const iconAssetByName = {
        forgedkeyblue: new URL('../../assets/img/forgedkeyblue.png', import.meta.url).href,
        forgedkeyred: new URL('../../assets/img/forgedkeyred.png', import.meta.url).href,
        forgedkeyyellow: new URL('../../assets/img/forgedkeyyellow.png', import.meta.url).href,
        unforgedkeyblue: new URL('../../assets/img/unforgedkeyblue.png', import.meta.url).href,
        unforgedkeyred: new URL('../../assets/img/unforgedkeyred.png', import.meta.url).href,
        unforgedkeyyellow: new URL('../../assets/img/unforgedkeyyellow.png', import.meta.url).href
    };

    const onButtonClick = (command, arg, uuid, method) => {
        if (props.onButtonClick) {
            props.onButtonClick(command, arg, uuid, method);
        }
    };

    const onMouseOver = (card) => {
        if (card && props.onMouseOver) {
            props.onMouseOver({
                image: card ? <CardImage card={card} /> : null,
                size: 'normal'
            });
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
                return t(text, { ...values, card: source.locale[i18n.language].name });
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
            const normalizedButtonText = (originalButtonText || '').trim().toLowerCase();
            const isCancel =
                normalizedButtonText === 'cancel' ||
                (button.command || '').toLowerCase().includes('cancel');
            const buttonClass = isCancel
                ? 'w-full justify-center whitespace-nowrap text-sm capitalize !px-2 !py-1.5 !text-foreground/70'
                : 'w-full justify-center whitespace-nowrap text-sm capitalize !px-2 !py-1.5';

            let option = (
                <Button
                    variant='tertiary'
                    key={button.command + buttonIndex.toString()}
                    className={buttonClass}
                    title={originalButtonText}
                    onPress={() =>
                        onButtonClick(button.command, button.arg, button.uuid, button.method)
                    }
                    onMouseOver={() => onMouseOver(button.card)}
                    onMouseOut={() => onMouseOut(button.card)}
                    isDisabled={button.disabled}
                >
                    <span className='inline-flex w-full min-w-0 items-center gap-2'>
                        <span className='min-w-0 flex-1 truncate text-center'>{buttonText}</span>
                        {button.icon &&
                            (iconAssetByName[button.icon] ? (
                                <img
                                    src={iconAssetByName[button.icon]}
                                    alt=''
                                    className='inline-block h-5 w-5 shrink-0'
                                />
                            ) : (
                                <div
                                    className={`h-6 w-6 shrink-0 bg-cover bg-center bg-no-repeat icon-${button.icon}`}
                                />
                            ))}
                    </span>
                </Button>
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

        return props.controls.map((control, index) => {
            const key = control.uuid || `${control.type}-${index}`;
            switch (control.type) {
                case 'targeting':
                    return (
                        <AbilityTargeting
                            key={key}
                            onMouseOut={props.onMouseOut}
                            onMouseOver={props.onMouseOver}
                            source={control.source}
                            targets={control.targets}
                        />
                    );
                case 'card-name':
                    return (
                        <CardNameLookup
                            key={key}
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
                            key={key}
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
                        <HouseSelect
                            key={key}
                            buttons={props.buttons}
                            onHouseSelected={onControlSelected}
                        />
                    );
                case 'options-select':
                    return (
                        <OptionsSelect
                            key={key}
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
            <div className='-mx-3 -mt-2 mb-3 border-b border-border/70 bg-accent/12 px-3 py-1 text-center text-sm'>
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
                const localized = localizedText(controlSource, token, props.promptText.values);
                promptTexts.push(
                    <span key={`prompt-text-${promptTexts.length}`}>{localized}</span>
                );
                promptTexts.push(<br key={`prompt-br-${promptTexts.length}`} />);
            }
        } else {
            promptTexts.push(
                <span key='prompt-text-single'>
                    {localizedText(controlSource, promptText, props.promptText.values)}
                </span>
            );
        }
    }

    return (
        <div className='mx-auto w-full max-w-full px-1'>
            <Panel
                title={t(props.phase + ' phase')}
                titleClass='text-sm font-medium uppercase tracking-wide'
                contentClassName='px-2 py-1.5'
                className='!w-full !rounded-xl overflow-hidden'
            >
                {timer}
                {promptTitle}
                <div className='px-1 text-center'>
                    <h4 className='mb-2 text-base font-medium leading-snug'>{promptTexts}</h4>
                    <div className='space-y-1.5'>{getControls()}</div>
                    <div className='mt-2 space-y-1.5'>{getButtons()}</div>
                </div>
            </Panel>
        </div>
    );
};

ActivePlayerPrompt.displayName = 'ActivePlayerPrompt';
export default ActivePlayerPrompt;
