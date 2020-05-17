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
        let { img, maverick, anomaly, amber, enhancements, i18n } = this.props;

        if(!this.props.img) {
            return;
        }

        let langToUse = this.props.language ? this.props.language : i18n.language;

        let imgPath = (langToUse === 'en') ? img : img.replace('/cards/', '/cards/' + langToUse + '/');

        let imagesToMerge = [];

        if(maverick) {
            let bonusIcons = (amber > 0) || (enhancements && enhancements.length > 0);
            let maverickHouseImg = '/img/maverick/maverick-' + maverick + (bonusIcons ? '-amber' : '') + '.png';
            imagesToMerge.push({ src: maverickHouseImg, x: 0, y: 0 });
            imagesToMerge.push({ src: '/img/maverick/maverick-corner.png', x: 210, y: 0 });
        }

        if(anomaly) {
            let maverickHouseImg = '/img/maverick/maverick-' + anomaly + (amber > 0 ? '-amber' : '') + '.png';
            imagesToMerge.push({ src: maverickHouseImg, x: 0, y: 0 });
        }

        if(enhancements && enhancements.length > 0) {
            let y = 59 + (amber * 30);
            imagesToMerge.push({ src: `/img/enhancements/base-${enhancements.length}.png`, x: 14, y });
            enhancements.forEach((enhancement,index) => {
                imagesToMerge.push({ src: `/img/enhancements/${enhancement}.png`, x: 21, y: (y + 10) + (index * 31) });
            });
        }

        if(imagesToMerge.length > 0) {
            mergeImages([
                imgPath,
                ...imagesToMerge
            ]).then(src => this.setState({ src }))
                .catch(err => this.setState({ err: err.toString() }));
        } else {
            this.setState({ src: imgPath });
        }
    }

    render() {
        return (
            <Fragment>
                <img src={ this.state.src } alt={ this.props.alt } className={ this.props.className }/>
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
    enhancements: PropTypes.array,
    i18n: PropTypes.object,
    img: PropTypes.string.isRequired,
    language: PropTypes.string,
    maverick: PropTypes.string
};

export default withTranslation()(CardImage);
