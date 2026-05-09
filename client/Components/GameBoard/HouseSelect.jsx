import React from 'react';
import { useTranslation } from 'react-i18next';
import { Constants } from '../../constants';

/**
 * @typedef HouseSelectProps
 * @property {Object[]} buttons array of buttons
 * @property {function(Object): void} onHouseSelected Called when a button is pressed
 */

/**
 * @param {HouseSelectProps} props
 */
const HouseSelect = (props) => {
    const MaxHousesPerRow = 5;
    const { t } = useTranslation();
    const baseIconClasses = 'ms-1 h-6 w-6 bg-cover bg-center bg-no-repeat';

    const getHouse = (house) => {
        let houseTitle = t(house);
        return houseTitle[0].toUpperCase() + houseTitle.slice(1);
    };

    let icons = [];
    let iconRows = [];
    let houses = Constants.Houses;
    let i = 0;
    let j = 0;

    for (let house of houses) {
        let houseButton = props.buttons.find((b) => b.text === house);
        if (houseButton) {
            icons.push(
                <div
                    title={getHouse(houseButton.text)}
                    className={`${baseIconClasses} cursor-pointer hover:bg-accent/30 icon-${houseButton.text}`}
                    key={houseButton.text}
                    onClick={() => {
                        if (props.onHouseSelected) {
                            props.onHouseSelected(
                                houseButton.command,
                                houseButton.uuid,
                                undefined,
                                houseButton.arg
                            );
                        }
                    }}
                />
            );
        } else {
            icons.push(
                <div className={`${baseIconClasses} opacity-40 icon-${house}`} key={house} />
            );
        }

        if (++i === MaxHousesPerRow) {
            iconRows.push(
                <div className='mb-1 flex justify-center' key={`line-${++j}`}>
                    {icons}
                </div>
            );
            i = 0;
            icons = [];
        }
    }

    iconRows.push(
        <div className='mb-1 flex justify-center' key={`line-${++j}`}>
            {icons}
        </div>
    );

    return <div>{iconRows}</div>;
};

export default HouseSelect;
