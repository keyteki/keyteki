import React from 'react';
import PropTypes from 'prop-types';

import AbilityTargeting from './AbilityTargeting';
import CardNameLookup from './CardNameLookup';

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

    getButtons() {
        let buttonIndex = 0;

        let buttons = [];

        if(!this.props.buttons) {
            return null;
        }

        for(const button of this.props.buttons) {
            let option = (
                <button key={ button.command + buttonIndex.toString() }
                    className='btn btn-default prompt-button'
                    onClick={ event => this.onButtonClick(event, button.command, button.arg, button.uuid, button.method) }
                    onMouseOver={ event => this.onMouseOver(event, button.card) }
                    onMouseOut={ event => this.onMouseOut(event, button.card) }
                    disabled={ button.disabled }>{ button.text } { button.icon && <div className={ `button-icon icon-${button.icon}` } /> }</button>);

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
        let promptTitle;

        if(this.props.promptTitle) {
            promptTitle = (<div className='menu-pane-source'>{ this.props.promptTitle }</div>);
        }

        let timer = null;

        let promptText = [];

        if(this.props.promptText.includes('\n')) {
            let split = this.props.promptText.split('\n');
            for(let token of split) {
                promptText.push(token);
                promptText.push(<br />);
            }
        } else {
            promptText.push(this.props.promptText);
        }

        return (<div>
            { timer }
            <div className={ 'phase-indicator ' + this.props.phase } onClick={ this.props.onTitleClick }>
                { this.props.phase } phase
            </div>
            { promptTitle }
            <div className='menu-pane'>
                <div className='panel'>
                    <h4>{ promptText }</h4>
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
    onButtonClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    onTitleClick: PropTypes.func,
    phase: PropTypes.string,
    promptText: PropTypes.string,
    promptTitle: PropTypes.string,
    socket: PropTypes.object,
    user: PropTypes.object
};

export default ActivePlayerPrompt;
