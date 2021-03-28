import React from 'react';
import PropTypes from 'prop-types';
import { Constants } from '../../constants';

import './HouseSelect.scss';

class HouseSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedValue: ''
        };
    }

    onHouseClicked(button) {
        if (this.props.onHouseSelected) {
            this.props.onHouseSelected(button.command, button.uuid, undefined, button.arg);
        }
    }

    render() {
        let icons = [];
        let iconRows = [];
        let houses = Constants.Houses;
        let i = 0;

        for (let house of houses) {
            let houseButton = this.props.buttons.find((b) => b.text === house);
            if (houseButton) {
                icons.push(
                    <div
                        className={`button-icon icon-${houseButton.text}`}
                        key={houseButton.text}
                        onClick={this.onHouseClicked.bind(this, houseButton)}
                    />
                );
            } else {
                icons.push(<div className={`button-icon icon-${house} disabled`} key={house} />);
            }

            if (++i === 5) {
                iconRows.push(<div className='house-icon-row'>{icons}</div>);

                i = 0;

                icons = [];
            }
        }

        iconRows.push(<div className='house-icon-row'>{icons}</div>);

        return <div>{iconRows}</div>;
    }
}

HouseSelect.displayName = 'HouseSelect';
HouseSelect.propTypes = {
    buttons: PropTypes.array,
    onHouseSelected: PropTypes.func,
    values: PropTypes.array
};

export default HouseSelect;
