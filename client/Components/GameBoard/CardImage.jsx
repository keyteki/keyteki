import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import mergeImages from 'merge-images';

import { withTranslation } from 'react-i18next';

class CardImage extends Component {
    constructor() {
        super();
        this.state = { src: '', err: '' };

        this.onClick = this.onClick.bind(this);
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
        let { img, i18n } = this.props;
        
        if(!this.props.img) {
            return;
        }


        let langToUse = this.props.language ? this.props.language : i18n.language;

        let imgPath = this.props.img;
        if (this.props.isDeckbuilder) {
            imgPath = '/img/cards/' + this.props.img;
        } else {
            imgPath = (langToUse === 'en') ? img : img.replace('/cards/', '/cards/' + langToUse + '/');
        }

        this.setState({ src: imgPath });

    }

    onClick() {
        this.props.selectFunction(this.props.id);
    }

    render() {
        return (
            <Fragment>
                <img src={ this.state.src } alt={ this.props.alt } className={ this.props.className } onClick={ this.onClick } />
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
