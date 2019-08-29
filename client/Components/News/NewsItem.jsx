import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { getMessageWithLinks } from '../../util';

class NewsItem extends React.Component {
    render() {
        let parts = getMessageWithLinks(this.props.text);

        return (
            <div className='news-item'>
                <span className={ `news-icon ${this.props.icon}` } />
                &nbsp;{ moment(this.props.date).format('YYYY-MM-DD') + ' - ' }{ parts }
            </div>);
    }
}

NewsItem.displayName = 'NewsItem';
NewsItem.propTypes = {
    date: PropTypes.string,
    icon: PropTypes.oneOf(['military', 'intrigue', 'power']),
    text: PropTypes.string
};

export default NewsItem;
