import React from 'react';

export class CardEntry extends React.Component {
    constructor() {
        super();

        this.hover = false;

        this.toggleHover = this.toggleHover.bind(this);
    }

    toggleHover() {
        this.hover = !this.hover;
        this.forceUpdate();
    }


    render() {
        return (
            <div className="cardEntry" 
            onMouseEnter={this.toggleHover}
            onMouseLeave={this.toggleHover}>
                <div className="cardContainer">
                    <p>{this.props.cardName} ({this.props.count})</p>
                    &nbsp;
                    &nbsp;
                    {this.hover && this.props.count > 1 ? <button className="minusButton">&#8213;</button> : ''}
                    {this.hover ? <button className="deleteButton">&#10006;</button> : ''}
                </div>
            </div>
        ); 
    }

}


export default CardEntry;
