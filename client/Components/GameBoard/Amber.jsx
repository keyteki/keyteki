import React from 'react';
import { useTranslation } from 'react-i18next';

import './Amber.scss';

const AmberImage = require(`../../assets/img/amber.png`);

const Amber = ({ animation, delay = 0 }) => {
    const { t: translation } = useTranslation();
    return (
        <div>
            <img
                className={`gained-amber ${animation} delay-${delay}`}
                src={AmberImage}
                title={translation('1 Amber')}
            />
        </div>
    );
};

export default Amber;
