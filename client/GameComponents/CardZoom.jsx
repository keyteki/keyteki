import React from 'react';

class CardZoom extends React.Component {
    render() {
        var zoomClass = 'card-large';

        if(this.props.orientation === 'horizontal') {
            zoomClass += '-horizontal';
        }

        return (
            <div className={zoomClass}>
                {this.props.show ?
                    <div className='card-zoomed shadow'>
                        <img src={this.props.imageUrl} />
                    </div>
                    : null}
            </div>);
    }
}

CardZoom.displayName = 'CardZoom';
CardZoom.propTypes = {
    imageUrl: React.PropTypes.string,
    orientation: React.PropTypes.oneOf(['horizontal', 'vertical']),
    show: React.PropTypes.bool
};

export default CardZoom;
