import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';

const mapStateToProps = (state, ownProps) => {
    return {
        href: ownProps.href
    };
};

class InnerLink extends React.Component {
    constructor() {
        super();

        this.onClick = this.onClick.bind(this);
    }

    onClick(event) {
        event.preventDefault();
        this.props.navigate(this.props.href);
    }

    render() {
        return (
            <a className={this.props.className} href={this.props.href} onClick={this.onClick}>
                {this.props.children}
            </a>
        );
    }
}

InnerLink.displayName = 'Link';
InnerLink.propTypes = {
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    className: PropTypes.string,
    href: PropTypes.string,
    navigate: PropTypes.func
};

const Link = connect(mapStateToProps, actions)(InnerLink);

export default Link;
