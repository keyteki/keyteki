const Card = require('../../Card.js');

class GuardianDemon extends Card {
    // Play/Fight/Reap: Heal up to 2 damage from a creature. Deal that amount of damage to another creature.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            condition: (context) =>
                context.game.creaturesInPlay.some((card) => card.hasToken('damage')),
            target: {
                activePromptTitle: 'Choose a creature to heal',
                optional: true,
                cardType: 'creature',
                gameAction: ability.actions.heal({ amount: 2, upTo: true })
            },
            then: (context) => ({
                target: {
                    activePromptTitle: 'Choose a creature to deal damage to',
                    cardType: 'creature',
                    cardCondition: (card) => card !== context.target,
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount: context.preThenEvent.amount
                    }))
                },
                message: '{0} uses {1} to deal {3} damage to {2}',
                messageArgs: (context) => context.preThenEvent.amount
            })
        });
    }
}

GuardianDemon.id = 'guardian-demon';

module.exports = GuardianDemon;
