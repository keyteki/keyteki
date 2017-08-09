import React from 'react';
import _ from 'underscore';

class ActivePlayerPrompt extends React.Component {
    constructor() {
        super();

        this.timer = {};

        this.state = {
        };
    }

    shouldComponentUpdate(newProps, newState) {
        return newProps.phase !== this.props.phase || newProps.promptTitle !== this.props.promptTitle ||
            newProps.title !== this.props.title || newProps.arrowDirection !== this.props.arrowDirection ||
            newState.showTimer !== this.state.showTimer ||
            newState.timeLeft !== this.state.timeLeft || newState.timerClass !== this.state.timerClass;
    }

    componentWillUpdate(newProps, newState) {
        if(_.difference(newProps.buttons, this.props.buttons).length === 0) {
            return;
        }

        if(newProps.user.settings && newProps.user.settings.windowTimer === 0) {
            return;
        }

        if(_.any(newProps.buttons, button => {
            return button.timer;
        })) {
            if(newState.timerHandle) {
                return;
            }

            this.timer.started = new Date();
            this.timer.timerTime = (_.isUndefined(newProps.user.settings) || _.isUndefined(newProps.user.settings.windowTimer)) ? 10 : newProps.user.settings.windowTimer;

            let handle = setInterval(() => {
                let now = new Date();
                let difference = (now - this.timer.started) / 1000;
                let keepGoing = true;

                if(difference >= this.timer.timerTime) {
                    clearInterval(this.state.timerHandle);

                    keepGoing = false;

                    this.setState({ timerHandle: undefined });

                    if(newProps.onTimerExpired) {
                        newProps.onTimerExpired();
                    }
                }

                let timerClass = (((this.timer.timerTime - difference) / this.timer.timerTime) * 100).toFixed() + '%';
                this.setState({
                    showTimer: keepGoing,
                    timerClass: timerClass,
                    timeLeft: (this.timer.timerTime - difference).toFixed()
                });
            }, 100);

            this.setState({ showTimer: true, timerClass: '100%', timerHandle: handle });
        }
    }

    onButtonClick(event, command, arg, method) {
        event.preventDefault();

        if(this.state.timerHandle) {
            clearInterval(this.state.timerHandle);
        }

        this.setState({ showTimer: false, timerHandle: undefined, timerCancelled: true });

        if(this.props.onButtonClick) {
            this.props.onButtonClick(command, arg, method);
        }
    }

    onCancelTimerClick(event, button) {
        event.preventDefault();

        if(this.state.timerHandle) {
            clearInterval(this.state.timerHandle);
        }

        this.setState({ showTimer: false, timerHandle: undefined, timerCancelled: true });

        if(button.method) {
            this.props.onButtonClick(button.command, button.arg, button.method);
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

        _.each(this.props.buttons, button => {
            if(button.timer) {
                return;
            }

            let clickCallback = button.timerCancel ? event => this.onCancelTimerClick(event, button) :
                event => this.onButtonClick(event, button.command, button.arg, button.method);

            let option = (
                <button key={ button.command + buttonIndex.toString() }
                    className='btn btn-primary'
                    onClick={ clickCallback }
                    onMouseOver={ event => this.onMouseOver(event, button.card) }
                    onMouseOut={ event => this.onMouseOut(event, button.card) }
                    disabled={ button.disabled }>{ button.text }</button>);

            buttonIndex++;

            buttons.push(option);
        });

        return buttons;
    }

    render() {
        let promptTitle;

        if(this.props.promptTitle) {
            promptTitle = (<div className='menu-pane-source'>{ this.props.promptTitle }</div>);
        }

        let timer = null;

        if(this.state.showTimer) {
            timer = (
                <div>
                    <span>Auto passing in { this.state.timeLeft }...</span>
                    <div className='progress'>
                        <div className='progress-bar progress-bar-success' role='progressbar' style={ { width: this.state.timerClass } } />
                    </div>
                </div>);
        }

        var arrow = null;
        if(this.props.arrowDirection === 'up') {
            arrow = <span className='up-arrow' />;
        } else if(this.props.arrowDirection === 'down') {
            arrow = <span className='down-arrow' />;
        }

        return (<div>
            { timer }
            <div className={ 'phase-indicator ' + this.props.phase } onClick={ this.props.onTitleClick }>
                { arrow }
                { this.props.phase } phase
            </div>
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

ActivePlayerPrompt.displayName = 'ActivePlayerPrompt';
ActivePlayerPrompt.propTypes = {
    arrowDirection: React.PropTypes.oneOf([
        'up',
        'down',
        'none'
    ]),
    buttons: React.PropTypes.array,
    onButtonClick: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    onTimerExpired: React.PropTypes.func,
    onTitleClick: React.PropTypes.func,
    phase: React.PropTypes.string,
    promptTitle: React.PropTypes.string,
    socket: React.PropTypes.object,
    title: React.PropTypes.string,
    user: React.PropTypes.object
};

export default ActivePlayerPrompt;
