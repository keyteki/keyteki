import React from 'react';

import './Amber.scss';

const AmberImage = require(`../../assets/img/amber.png`);

const Amber = ({ animation, delay = 0 }) => {
    return (
        <div>
            <img className={`animated-amber ${animation} delay-${delay}`} src={AmberImage} />
        </div>
    );
};

export default Amber;
