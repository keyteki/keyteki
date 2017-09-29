import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class NewsItem extends React.Component {
    render() {
        return (
            <div className={ this.props.icon + '-container' }>
                <span className={ 'icon-' + this.props.icon } />
                &nbsp;{ moment(this.props.date).format('YYYY-MM-DD') + ' - ' + this.props.text }
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
