import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class NewsItem extends React.Component {
    constructor(props) {
        super(props);

        this.regex = new RegExp(/(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?/, 'ig');
    }
    render() {
        let tokens = this.props.text.split(/\s/);

        let i = 0;
        let parts = tokens.map(t => {
            if(t.match(this.regex)) {
                return <a key={ `link-${i++}` } href={ t } target='_blank'>{ t }</a>;
            }

            return t + ' ';
        });

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
