import React from 'react';
import _ from 'underscore';

class MenuPane extends React.Component {
    constructor() {
        super();

        this.onButtonClick = this.onButtonClick.bind(this);
    }

    onButtonClick(event, command, arg, method) {
        event.preventDefault();

        if(this.props.onButtonClick) {
            this.props.onButtonClick(command, arg, method);
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
        var buttonIndex = 0;

        var buttons = _.map(this.props.buttons, button => {
            var option = (
                <button key={ button.command + buttonIndex.toString() } className='btn btn-primary'
                    onClick={ event => this.onButtonClick(event, button.command, button.arg, button.method) }
                    onMouseOver={ event => this.onMouseOver(event, button.card) } onMouseOut={ event => this.onMouseOut(event, button.card) }
                    disabled={ button.disabled }>{ button.text }</button>);

            buttonIndex++;

            return option;
        });

        return buttons;
    }

    render() {
        let promptTitle;

        if(this.props.promptTitle) {
            promptTitle = (<div className='menu-pane-source'>{ this.props.promptTitle }</div>);
        }

        return (<div>
            { promptTitle }
            <div className='menu-pane'>
                <div className='panel'>
                    <h4>{ this.props.title }</h4>
                    { this.getButtons() }
                </div>
            </div>
        </div>);
    }
}

MenuPane.displayName = 'MenuPane';
MenuPane.propTypes = {
    buttons: React.PropTypes.array,
    onButtonClick: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    promptTitle: React.PropTypes.string,
    socket: React.PropTypes.object,
    title: React.PropTypes.string
};

export default MenuPane;
