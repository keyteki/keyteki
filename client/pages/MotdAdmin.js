import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Panel from '../Components/Site/Panel';
import TextArea from '../Components/Form/TextArea';
import RadioGroup from '../Components/Form/RadioGroup';
import * as actions from '../actions';

class MotdAdmin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            motdText: props.motd && props.motd.message,
            selectedMotdType: props.motd ? props.motd.motdType : 'info'
        };

        this.motdTypes = [
            { value: 'error', label: 'Error (red)' },
            { value: 'warning', label: 'Warning (yellow)' },
            { value: 'info', label: 'Info (blue)' },
            { value: 'success', label: 'Success (green)' }
        ];

        this.onMotdTextChange = this.onMotdTextChange.bind(this);
        this.onSaveClick = this.onSaveClick.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({ motdText: props.motd && props.motd.message, selectedMotdType: props.motd ? props.motd.motdType : 'info' });
    }

    onMotdTextChange(event) {
        this.setState({ motdText: event.target.value });
    }

    onMotdTypeChange(value) {
        this.setState({ selectedMotdType: value });
    }

    onSaveClick(event) {
        event.preventDefault();

        this.props.sendSocketMessage('motd', { message: this.state.motdText, motdType: this.state.selectedMotdType });
    }

    render() {
        return (<div className='col-sm-offset-2 col-sm-8' >
            <Panel title='Motd administration'>
                <TextArea fieldClass='col-xs-12' name='motd' value={ this.state.motdText } onChange={ this.onMotdTextChange } rows='4'
                    placeholder='Enter a motd message' />
                <div className='col-xs-12'>
                    <RadioGroup buttons={ this.motdTypes } onValueSelected={ this.onMotdTypeChange.bind(this) } />
                </div>

                <button className='btn btn-primary col-xs-2 motd-button' type='button' onClick={ this.onSaveClick }>Save</button>
            </Panel>
        </div >);
    }
}

MotdAdmin.displayName = 'MotdAdmin';
MotdAdmin.propTypes = {
    motd: PropTypes.object,
    sendSocketMessage: PropTypes.func
};

function mapStateToProps(state) {
    return {
        motd: state.lobby.motd
    };
}

export default connect(mapStateToProps, actions)(MotdAdmin);
