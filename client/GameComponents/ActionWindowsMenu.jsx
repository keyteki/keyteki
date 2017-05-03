import React from 'react';
import _ from 'underscore';

class ActionWindowsMenu extends React.Component {
    constructor() {
        super();

        this.windows = [
            { name: 'plot', label: 'Plots revealed' },
            { name: 'draw', label: 'Draw phase' },
            { name: 'challengeBegin', label: 'Challenge phase begins' },
            { name: 'attackersDeclared', label: 'Attackers declared' },
            { name: 'defendersDeclared', label: 'Defenders declared' },
            { name: 'winnerDetermined', label: 'Winner determined' },
            { name: 'dominance', label: 'Dominance phase' },
            { name: 'standing', label: 'Standing phase' }
        ];
    }

    onToggle(option, value) {
        if(this.props.onToggle) {
            this.props.onToggle(option, !value);
        }
    }

    render() {
        let actionWindows = _.map(this.windows, window => {
            return (
                <div className='checkbox'>
                    <label>
                        <input type='checkbox'
                            checked={ this.props.options[window.name] }
                            onChange={ this.onToggle.bind(this, window.name, this.props.options[window.name]) } />{ window.label }
                    </label>
                </div>
            );
        });

        return (
            <div className='panel always-prompt'>
                Always prompt action windows
                { actionWindows }
            </div>
        );
    }
}

ActionWindowsMenu.displayName = 'ActionWindowsMenu';
ActionWindowsMenu.propTypes = {
    onToggle: React.PropTypes.func,
    options: React.PropTypes.object
};

export default ActionWindowsMenu;
