const Card = require('./Card.js');

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

    get powerForPlayRestriction() {
        let powerPrinted = this.powerPrinted;

        // Gigantic creatures are restricted by the bottom half's power. The top
        // half should not be considered to have printed power except in the
        // case when its needed for a restriction check that is based on power.
        if (this.gigantic && !this.giganticBottom && !this.composedPart) {
            // Cannot use getBottomCard while in hand because it is not composed with the top half
            const bottomCard = this.controller.allCards.find(
                (card) => card.id === this.compositeId
            );
            if (bottomCard) {
                powerPrinted = bottomCard.powerPrinted;
            }
        }
        return powerPrinted;
    }

    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.cardCannot('play', (context) => {
                // Block the card from being played from hand if the other half
                // is not present. If the card is being played from somewhere
                // other than hand (e.g., discard with Exhume), it should be
                // selectable. After selection, the play will fizzle if the
                // ability doesn't have enough play allowances to compose both
                // halves.
                if (context.source.location !== 'hand') {
                    return false;
                }

                return (
                    !context.source.controller.hand.some((card) => this.id === card.id) ||
                    !context.source.controller.hand.some((card) => this.compositeId === card.id)
                );
            })
        });
    }
}

module.exports = GiganticCard;
