import React from 'react';
import _ from 'underscore';
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

    getStatus() {
        var index = 0;

        var extendedStatuses = _.map(this.props.list, text => {
            return <li key={ index++ } className='text-danger'>{ text }</li>;
        });

        return extendedStatuses;
    }

    render() {
        let content = ReactDOMServer.renderToString((<ul>{ this.getStatus() }</ul>));

        return (
            <span data-trigger='hover' data-html='true' data-toggle='popover' data-content={ content }>
                { this.props.status }
            </span>
        );
    }
}

StatusPopOver.displayName = 'StatusPopOver';
StatusPopOver.propTypes = {
    list: React.PropTypes.array,
    show: React.PropTypes.bool,
    status: React.PropTypes.string
};

export default StatusPopOver;
