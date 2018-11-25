import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Panel extends React.Component {
    render() {
        return (
            <div className={ classNames('panel', `panel-${this.props.type}`, this.props.className) }>
                { this.props.title &&
                    <div className='panel-heading'>
                        { this.props.title }
                    </div>
                }
                <div className='panel-body'>
                    { this.props.children }
                </div>
            </div>);
    }
}

Panel.displayName = 'Panel';
Panel.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.oneOf(['danger', 'success', 'warning', 'info', 'default', 'primary', 'tertiary'])
};
Panel.defaultProps = {
    type: 'tertiary'
};

export default Panel;
