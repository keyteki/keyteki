const Card = require('../../Card.js');

class Wardrummer extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'return each other Brobnar creature to hand',
            gameAction: ability.actions.returnToHand((context) => ({
                target: context.player.cardsInPlay.filter(
                    (card) =>
                        card.type === 'creature' &&
                        card.hasHouse('brobnar') &&
                        card !== context.source
                )
            }))
        });
    }
}

Wardrummer.id = 'wardrummer';

module.exports = Wardrummer;
