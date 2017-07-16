import React from 'react';
import moment from 'moment';

class NewsItem extends React.Component {
    render() {
        return (
            <div>
                <span className={ 'icon-' + this.props.icon } />
                &nbsp;{ moment(this.props.date).format('YYYY-MM-DD') + ' - ' + this.props.text }
            </div>);
    }
}

NewsItem.displayName = 'NewsItem';
NewsItem.propTypes = {
    date: React.PropTypes.string,
    icon: React.PropTypes.oneOf(['military', 'intrigue', 'power']),
    text: React.PropTypes.string
};

export default NewsItem;
