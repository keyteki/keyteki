import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import ReactDOMServer from 'react-dom/server';

class StatusPopOver extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showing: false
        };
    }

    componentDidMount() {
        this.updateProps(this.props);
    }

    componentWillReceiveProps(props) {
        this.updateProps(props);
    }

    updateProps(props) {
        let popovers = $('[data-toggle="popover"]');

        if(!popovers || !popovers.popover) {
            return;
        }

        if(props.show && !this.state.showing) {
            popovers.popover();
        } else if(!props.show && this.state.showing) {
            popovers.popover('destroy');
        }

        this.setState({ showing: props.show });
    }

    render() {
        let content = ReactDOMServer.renderToString(this.props.children);

        return (
            <span data-trigger='hover' data-html='true' data-toggle='popover' data-content={ content }>
                { this.props.status }
            </span>
        );
    }
}

StatusPopOver.displayName = 'StatusPopOver';
StatusPopOver.propTypes = {
    children: PropTypes.node.isRequired,
    show: PropTypes.bool,
    status: PropTypes.string
};

export default StatusPopOver;
