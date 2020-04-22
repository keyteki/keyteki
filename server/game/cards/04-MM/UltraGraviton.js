const Card = require('../../Card.js');

class UltraGraviton extends Card {
    constructor(owner, cardData) {
        super(owner, cardData);
        // TODO This could be temporary - depends if the final JSON will contain this info or not
        // I added this to help 'It's Coming...'
        this.gigantic = true;
        this.playedParts = [];
    }

    get compositeParts() {
        return ['ultra-graviton-2'];
    }

    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            match: this,
            effect: ability.effects.cardCannot('play', context => {
                return context.source.location !== 'hand' ||
                    this.compositeParts.some(id => !context.source.controller.hand.some(card => id === card.id));
            })
        });

        this.play({
            gameAction: ability.actions.archive(context => ({
                target: context.player.deck.slice(0, 5)
            }))
        });

        this.fight({
            reap: true,
            target: {
                location: 'archives',
                controller: 'self',
                gameAction: ability.actions.discard()
            },
            then: {
                target: {
                    location: 'play area',
                    gameAction: ability.actions.purge() //and.... resolve TODO
                }
            }
        });
    }

    moveTo(targetLocation) {
        super.moveTo(targetLocation);

        if(this.location === 'play area') {
            this.compositeParts.forEach(id => {
                // Always remove the second part from hand
                let part = this.controller.getSourceList('hand').find(card => id === card.id);
                this.controller.removeCardFromPile(part);
                this.playedParts.push(part);
            });

            this.image = 'ultra-graviton-complete';
        } else {
            let cardPile = this.controller.getSourceList(this.location);
            let cardIndex = cardPile.indexOf(this);
            this.playedParts.forEach(part => {
                part.location = this.location;
                cardPile.splice(cardIndex, 0, part);
            });
            this.playedParts = [];
            this.image = this.id;
        }
    }
}

UltraGraviton.id = 'ultra-graviton';

module.exports = UltraGraviton;
