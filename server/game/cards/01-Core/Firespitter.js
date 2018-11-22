const Card = require('../../Card.js');

class Firespitter extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onFight: (event, context) => event.attacker === context.source
            },
            effect: 'deal 1 damage to each enemy creature',
            gameAction: ability.actions.dealDamage(context => ({
                amount: 1,
                target: context.game.creaturesInPlay.filter(card => card.controller !== context.player)
            }))
        });
    }
}

Firespitter.id = 'firespitter'; // This is a guess at what the id might be - please check it!!!

module.exports = Firespitter;
