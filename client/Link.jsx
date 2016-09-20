import React from 'react';
import {connect} from 'react-redux';
import * as actions from './actions';

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
        return (<a className={ this.props.className } href={ this.props.href } onClick={ this.onClick }>{ this.props.children }</a>);
    }
}

InnerLink.displayName = 'Link';
InnerLink.propTypes = {
    children: React.PropTypes.string,
    className: React.PropTypes.string,
    href: React.PropTypes.string,
    navigate: React.PropTypes.func
};

const Link = connect(mapStateToProps, actions)(InnerLink);

export default Link;
