import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import mergeImages from 'merge-images';

class CardImage extends Component {
    constructor() {
        super();
        this.state = { src: '', err: ''};
    }
    componentDidMount() {
        this.updateImage();
    }

    componentDidUpdate(prevProps) {
        if(this.props.img !== prevProps.img) {
            this.updateImage();
        }
    }

    updateImage() {
        let { img, maverick, amber } = this.props;

        if(maverick) {
            let maverickHouseImg = '/img/maverick/maverick-' + maverick + (amber > 0 ? '-amber' : '') + '.png';

            mergeImages([
                img,
                { src: maverickHouseImg, x: 0, y: 0},
                { src: '/img/maverick/maverick-corner.png', x: 210, y: 0}
            ]).then(src => this.setState({ src }))
                .catch(err => this.setState({ err: err.toString() }));
        } else {
            this.setState({src: img});
        }
    }

    render() {
        return (
            <Fragment>
                <img src={ this.state.src } alt={ this.props.alt } className={ this.props.className } />
                { this.state.err && <p>{ this.state.err } </p> }
            </Fragment>
        );
    }
}

CardImage.propTypes = {
    alt: PropTypes.string,
    amber: PropTypes.number,
    className: PropTypes.string,
    img: PropTypes.string.isRequired,
    maverick: PropTypes.string
};

export default CardImage;
