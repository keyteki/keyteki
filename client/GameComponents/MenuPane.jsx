import React from 'react';
import _ from 'underscore';

class MenuPane extends React.Component {
    constructor() {
        super();

        this.onButtonClick = this.onButtonClick.bind(this);
    }

    onButtonClick(event, command, arg) {
        event.preventDefault();

        if(this.props.onButtonClick) {
            this.props.onButtonClick(command, arg);
        }
    }

    getButtons() {
        var buttonIndex = 0;

        var buttons = _.map(this.props.buttons, button => {
            var option = (
                <button key={button.command + buttonIndex.toString()} className='btn btn-primary'
                    onClick={(event) => this.onButtonClick(event, button.command, button.arg)}
                    disabled={this.props.disabled}>{button.text}</button>);

            buttonIndex++;

            return option;
        });

        return buttons;
    }

    render() {
        return (<div className='menu-pane'>
            <div className='panel'>
                <h4>{this.props.title}</h4>
                {this.getButtons()}
            </div>
        </div>);
    }
}

MenuPane.displayName = 'MenuPane';
MenuPane.propTypes = {
    buttons: React.PropTypes.array,
    disabled: React.PropTypes.bool,
    onButtonClick: React.PropTypes.func,
    socket: React.PropTypes.object,
    title: React.PropTypes.string
};

export default MenuPane;
