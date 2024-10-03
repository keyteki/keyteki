const Card = require('../../Card.js');

class HungryHippogriff extends Card {
    // Each other friendly creature gains, “Destroyed: Move each A
    // from this creature to your pool.”
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => card !== context.source && card.type === 'creature',
            effect: ability.effects.gainAbility('destroyed', {
                gameAction: ability.actions.removeAmber({ all: true }),
                effect: 'move all amber from {0} to their pool',
                then: {
                    gameAction: ability.actions.gainAmber((context) => ({
                        amount: context.preThenEvent.amount
                    }))
                }
            })
        });
    }
}

HungryHippogriff.id = 'hungry-hippogriff';

module.exports = HungryHippogriff;
