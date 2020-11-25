const Card = require('./Card.js');

class GiganticCard extends Card {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.gigantic = true;
        if (this.id.endsWith('2')) {
            this.giganticBottom = false;
            this.compositeId = this.id.replace(/2$/, '');
            this.compositeImageId = this.compositeId + '-complete';
        } else {
            this.giganticBottom = true;
            this.compositeId = this.id + '2';
            this.compositeImageId = this.id + '-complete';
        }
    }

    getTraits(context) {
        if (this.location !== 'play area' && !this.giganticBottom) {
            return [];
        }

        return super.getTraits(context);
    }

    get power() {
        if (this.location !== 'play area' && !this.giganticBottom) {
            return 0;
        }

        return super.power;
    }

    get armor() {
        if (this.location !== 'play area' && !this.giganticBottom) {
            return 0;
        }

        return super.armor;
    }

    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.cardCannot('play', (context) => {
                return (
                    !context.source.controller.hand.some((card) => this.id === card.id) ||
                    !context.source.controller.hand.some((card) => this.compositeId === card.id)
                );
            })
        });
    }
}

module.exports = GiganticCard;
