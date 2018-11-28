import React from 'react';
import CircleType from 'circletype';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class IdentityCard extends React.Component {
    constructor(props) {
        super(props);

        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
    }

    componentDidMount() {
        if(this.idText) {
            new CircleType(this.idText).radius(60);
        }
    }

    onMouseOver() {
        if(this.props.onMouseOver) {
            this.props.onMouseOver({ identity: this.props.identity, houses: this.props.houses });
        }
    }

    onMouseOut() {
        if(this.props.onMouseOut) {
            this.props.onMouseOut();
        }
    }

    render() {
        let className = classNames('panel', 'card-pile', this.props.className, {
            [this.props.size]: this.props.size !== 'normal',
            'vertical': true
        });

        let index = 1;
        let houses = this.props.houses && this.props.houses.map(house => {
            return <div className={ `house id-house-${index++}` }><img key={ house } className='img-responsive' src={ `/img/house/${house}.png` } /></div >;
        });

        return (
            <div className={ className } onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut }>
                <div className='card-wrapper'>
                    <div className='card-frame'>
                        <div>
                            <img className={ `card-image vertical ${this.props.size}` } src='/img/idbacks/identity.jpg' title={ this.props.identity } />
                        </div>
                        <div className={ 'identity-text' } ref={ idText => this.idText = idText }>{ this.props.identity }</div>
                        <div className='identity-icons'>
                            { houses }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

IdentityCard.displayName = 'IdentityCard';
IdentityCard.propTypes = {
    card: PropTypes.object,
    className: PropTypes.string,
    houses: PropTypes.array,
    identity: PropTypes.string,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    size: PropTypes.string
};

export default IdentityCard;
