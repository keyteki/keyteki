const Card = require('../../Card.js');

class RocketeerTryska extends Card {
    //While the tide is high, Rocketeer Tryska's neighbors enter play ready.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: (context) => context.player.isTideHigh(),
            match: (card, context) =>
                card.type === 'creature' && context.source.neighbors.includes(card),
            effect: ability.effects.entersPlayReady()
        });
    }
}

RocketeerTryska.id = 'rocketeer-tryska';

module.exports = RocketeerTryska;
