import React from 'react';
import $ from 'jquery';
import { withRouter, Link } from 'react-router';

class Decks extends React.Component {
    constructor() {
        super();

        this.state = {
            decks: [],
            error: ''
        };
    }

    componentWillMount() {
        $.ajax({
            url: '/api/decks',
            type: 'GET'
        }).done((data) => {
            if(!data.success) {
                this.setState({ error: data.message });
                return;
            }

            this.setState({ decks: data.decks });
        }).fail((xhr) => {
            if(xhr.status === 401) {
                this.props.router.push('/login');
            }

            this.setState({ error: 'Could not communicate with the server.  Please try again later.' });
        });
    }

    render() {
        var errorBar = this.state.error ? <div className='alert alert-danger' role='alert'>{ this.state.error }</div> : null;
        var decks = [];
        var deckTable = (
            <table className='table'></table>
        );

        return (
            <div>
                { errorBar }
                <Link className='btn btn-default' to='/decks/add'>Add new deck</Link>
                { this.state.decks.length === 0 ? <div>You have no decks, try adding one.</div> : deckTable }
            </div>);
    }
}

Decks.displayName = 'Decks';
Decks.propTypes = {
    router: React.PropTypes.shape({
        push: React.PropTypes.func.isRequired
    }).isRequired
};

export default withRouter(Decks, { withRef: true });
