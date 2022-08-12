import React from 'react';
import { useTranslation } from 'react-i18next';
// import { useDispatch } from 'react-redux';
// import { sendGameMessage } from '../../redux/actions';

import './Amber.scss';

const AmberImage = require(`../../assets/img/amber.png`);

const Amber = ({ card }) => {
    const { t: translation } = useTranslation();
    const name = 'gained-amber' + (card.justReaped ? ' collect-gained-amber' : '');
    return (
        <div className='amber-wrapper'>
            <img className={name} src={AmberImage} title={translation('1 Amber')} />
        </div>
    );
};

export default Amber;
