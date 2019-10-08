import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { getMessageWithLinks } from '../../util';

class NewsItem extends React.Component {
    render() {
        let parts = getMessageWithLinks(this.props.text);

        return (
            <div className='news-item'>
                <div className={ `col-sm-1 news-icon ${this.props.icon}` } />
                &nbsp;{ moment(this.props.date).format('YYYY-MM-DD') + ' - ' }{ parts }
            </div>);
    }
}

NewsItem.displayName = 'NewsItem';
NewsItem.propTypes = {
    date: PropTypes.string,
    icon: PropTypes.oneOf(['unforged-red', 'unforged-blue', 'unforged-yellow']),
    text: PropTypes.string
};

export default NewsItem;
