import React from 'react';
import PropTypes from 'prop-types';

import AbilityTargeting from './AbilityTargeting';
import CardNameLookup from './CardNameLookup';

import { withTranslation, Trans } from 'react-i18next';

class ActivePlayerPrompt extends React.Component {
    onButtonClick(event, command, arg, uuid, method) {
        event.preventDefault();

        if(this.props.onButtonClick) {
            this.props.onButtonClick(command, arg, uuid, method);
        }
    }

    onMouseOver(event, card) {
        if(card && this.props.onMouseOver) {
            this.props.onMouseOver(card);
        }
    }

    onMouseOut(event, card) {
        if(card && this.props.onMouseOut) {
            this.props.onMouseOut(card);
        }
    }

    localizedText(source, text, values) {
        let { t, i18n } = this.props;

        if(!isNaN(text)) {
            // text is just a plain number, avoid translation
            return text;
        }

        if(!source || !source.locale) {
            // If no source or source does not have locale, simply do the translation
            return t(text, values);
        }

        if(values && values.card) {
            // if there is a {{card}} property in the values, we should use locale, if present

            let newValues = values;
            if(source.locale[i18n.language]) {
                newValues.card = source.locale[i18n.language].name;
            }

            return t(text, newValues);
        }

        if(!values && (source.name === text)) {
            // Text is a card name alone, let's use locale if present
            if(source.locale[i18n.language]) {
                return source.locale[i18n.language].name;
            }
        }

        return t(text, values);
    }

    getButtons() {
        let buttonIndex = 0;

        let buttons = [];

        if(!this.props.buttons) {
            return null;
        }

        for(const button of this.props.buttons) {

            let buttonText = this.localizedText(button.card, button.text, button.values);

            let option = (
                <button key={ button.command + buttonIndex.toString() }
                    className='btn btn-default prompt-button'
                    onClick={ event => this.onButtonClick(event, button.command, button.arg, button.uuid, button.method) }
                    onMouseOver={ event => this.onMouseOver(event, button.card) }
                    onMouseOut={ event => this.onMouseOut(event, button.card) }
                    disabled={ button.disabled }>{ buttonText } { button.icon && <div className={ `button-icon icon-${button.icon}` } /> }</button>);

            buttonIndex++;

            buttons.push(option);
        }

        return buttons;
    }

    onCardNameSelected(command, method, cardName) {
        if(this.props.onButtonClick) {
            this.props.onButtonClick(command, cardName, method);
        }
    }

    getControls() {
        if(!this.props.controls) {
            return null;
        }

        return this.props.controls.map(control => {
            switch(control.type) {
                case 'targeting':
                    return (
                        <AbilityTargeting
                            onMouseOut={ this.props.onMouseOut }
                            onMouseOver={ this.props.onMouseOver }
                            source={ control.source }
                            targets={ control.targets } />);
                case 'card-name':
                    return <CardNameLookup cards={ this.props.cards } onCardSelected={ this.onCardNameSelected.bind(this, control.command, control.method) } />;
            }
        });
    }

    render() {
        let controlSource = null;
        if(this.props.controls && (this.props.controls.length > 0) && this.props.controls[0].source) {
            controlSource = this.props.controls[0].source;
        }

        let promptTitle;

        if(this.props.promptTitle) {
            promptTitle = (<div className='menu-pane-source'>
                { this.localizedText(controlSource, this.props.promptTitle.text || this.props.promptTitle, this.props.promptTitle.values) }
            </div>);
        }

        let timer = null;
        let promptText = (typeof this.props.promptText === 'object') ?
            this.props.promptText.text : this.props.promptText;
        let promptTexts = [];

        if(promptText) {
            if(promptText.includes('\n')) {
                let split = promptText.split('\n');
                for(let token of split) {
                    promptTexts.push(this.localizedText(controlSource, token, this.props.promptText.values));
                    promptTexts.push(<br />);
                }
            } else {
                promptTexts.push(this.localizedText(controlSource, promptText, this.props.promptText.values));
            }
        }

        return (<div>
            { timer }
            <div className={ 'phase-indicator ' + this.props.phase } onClick={ this.props.onTitleClick }>
                <Trans>{ this.props.phase } phase</Trans>
            </div>
            { promptTitle }
            <div className='menu-pane'>
                <div className='panel'>
                    <h4>{ promptTexts }</h4>
                    { this.getControls() }
                    { this.getButtons() }
                </div>
            </div>
        </div>);
    }
}

ActivePlayerPrompt.displayName = 'ActivePlayerPrompt';
ActivePlayerPrompt.propTypes = {
    buttons: PropTypes.array,
    cards: PropTypes.object,
    controls: PropTypes.array,
    i18n:  PropTypes.object,
    onButtonClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    onTitleClick: PropTypes.func,
    phase: PropTypes.string,
    promptText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    promptTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    socket: PropTypes.object,
    t:  PropTypes.func,
    user: PropTypes.object
};

export default withTranslation()(ActivePlayerPrompt);
