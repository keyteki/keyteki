const Card = require('../../Card.js');

class Firespitter extends Card {
    setupCardAbilities(ability) {
        this.beforeFight({
            effect: 'deal 1 damage to each enemy creature',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 1,
                target: context.game.creaturesInPlay.filter(
                    (card) => card.controller !== context.player
                )
            }))
        });
    }
}

Firespitter.id = 'firespitter';

module.exports = Firespitter;
