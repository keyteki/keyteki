import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function GameBackgroundOption(props) {
    let { name, label, imageUrl, selected, onSelect } = props;

    const handleClick = () => {
        if (onSelect) {
            onSelect(name);
        }
    };

    return (
        <div className='col-sm-4' onClick={handleClick}>
            <img className={classNames('img-responsive', { selected: selected })} src={imageUrl} />
            <span className='bg-label'>{label}</span>
        </div>
    );
}

GameBackgroundOption.propTypes = {
    imageUrl: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onSelect: PropTypes.func,
    selected: PropTypes.bool
};

export default GameBackgroundOption;
