import React from 'react';
import _ from 'underscore';

class ActionWindowsMenu extends React.Component {
    constructor() {
        super();

        this.windows = [
            { name: 'dynasty', label: 'Dynasty phase' },
            { name: 'draw', label: 'Draw phase' },
            { name: 'preConflict', label: 'Conflict phase' },
            { name: 'conflict', label: 'During conflict' },
            { name: 'fate', label: 'Fate phase' },
            { name: 'regroup', label: 'Regroup phase' }
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
