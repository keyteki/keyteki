import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import mergeImages from 'merge-images';

import { withTranslation } from 'react-i18next';

class CardImage extends Component {
    constructor() {
        super();
        this.state = { src: '', err: '' };
    }

    componentDidMount() {
        this.updateImage();
    }

    componentDidUpdate(prevProps) {
        if((this.props.img !== prevProps.img) || (this.props.language !== prevProps.language)) {
            this.updateImage();
        }
    }

    updateImage() {
        let { img, maverick, anomaly, amber, i18n } = this.props;

        if(!this.props.img) {
            return;
        }

        let langToUse = this.props.language ? this.props.language : i18n.language;

        let imgPath = (langToUse === 'en') ? img : img.replace('/cards/', '/cards/' + langToUse + '/');

        if(maverick) {
            let maverickHouseImg = '/img/maverick/maverick-' + maverick + (amber > 0 ? '-amber' : '') + '.png';

            mergeImages([
                imgPath,
                { src: maverickHouseImg, x: 0, y: 0 },
                { src: '/img/maverick/maverick-corner.png', x: 210, y: 0 }
            ]).then(src => this.setState({ src }))
                .catch(err => this.setState({ err: err.toString() }));
        } else if(anomaly) {
            let maverickHouseImg = '/img/maverick/maverick-' + anomaly + (amber > 0 ? '-amber' : '') + '.png';

            mergeImages([
                imgPath,
                { src: maverickHouseImg, x: 0, y: 0 }
            ]).then(src => this.setState({ src }))
                .catch(err => this.setState({ err: err.toString() }));
        } else {
            this.setState({ src: imgPath });
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
    anomaly: PropTypes.string,
    className: PropTypes.string,
    i18n: PropTypes.object,
    img: PropTypes.string.isRequired,
    language: PropTypes.string,
    maverick: PropTypes.string
};

export default withTranslation()(CardImage);
