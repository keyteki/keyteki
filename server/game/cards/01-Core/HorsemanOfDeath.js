const Card = require('../../Card.js');

class HorsemanOfDeath extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.returnToHand(context => ({
                location: 'discard',
                target: context.player.discard.filter(card => card.type === 'creature' && card.hasTrait('horseman'))
            }))
        });
    }
}

HorsemanOfDeath.id = 'horseman-of-death'; // This is a guess at what the id might be - please check it!!!

module.exports = HorsemanOfDeath;
