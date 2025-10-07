import Card from './Card.js';

class GiganticCard extends Card {
    constructor(owner, cardData) {
        super(
            owner,
            cardData.id.endsWith('2')
                ? Object.assign(cardData, {
                      power: 0,
                      armor: 0,
                      keywords: null,
                      traits: null
                  })
                : Object.assign(cardData, { amber: 0, enhancements: null })
        );

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

    getTopCard() {
        return this.composedPart && !this.composedPart.giganticBottom ? this.composedPart : this;
    }

    getBottomCard() {
        return this.composedPart && this.composedPart.giganticBottom ? this.composedPart : this;
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

export default GiganticCard;
