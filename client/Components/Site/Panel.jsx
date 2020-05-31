import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Panel extends React.Component {
    render() {
        return (
            <div className={classNames('panel', `panel-${this.props.type}`, this.props.className)}>
                {this.props.title && (
                    <div className={classNames('panel-heading', this.props.titleClass)}>
                        {this.props.title}
                    </div>
                )}
                <div className='panel-body'>{this.props.children}</div>
            </div>
        );
    }
}

Panel.displayName = 'Panel';
Panel.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    title: PropTypes.string,
    titleClass: PropTypes.string,
    type: PropTypes.oneOf(['danger', 'success', 'warning', 'info', 'default', 'primary'])
};
Panel.defaultProps = {
    type: 'primary'
};

export default Panel;
