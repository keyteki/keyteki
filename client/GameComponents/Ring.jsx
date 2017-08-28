import React from 'react';

class Ring extends React.Component {
    constructor() {
        super();

        this.onClick = this.onClick.bind(this);
    }

    onClick(event, ring) {
        event.preventDefault();
        event.stopPropagation();

        if(this.props.onClick) {
            this.props.onClick(ring);
        }
    }

    render() {

        return (<div>
            <div className='ring' onClick={ event => this.onClick(event, this.props.ringType) } >
                <img className='ring' src={ '/img/' + this.props.conflictType + '-' + this.props.ringType + '.png' } />
            </div>
        </div>);
    }
}

Ring.displayName = 'Ring';
Ring.propTypes = {
    buttons: React.PropTypes.array,
    conflictType: React.PropTypes.string,
    fate: React.PropTypes.number,
    onClick: React.PropTypes.func,
    ringType: React.PropTypes.string,
    socket: React.PropTypes.object
};

export default Ring;
