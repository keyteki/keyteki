const Card = require('../../Card.js');

class OfficersBlaster extends Card {
    //This creature gains +2 power.
    //This creature gains, “Destroyed: Attach $this to this creature's right neighbor.”
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.modifyPower(2),
                ability.effects.gainAbility('destroyed', {
                    target: {
                        cardType: 'creature',
                        numCards: 1,
                        cardCondition: (card, context) => card === context.source.rightNeighbor,
                        gameAction: ability.actions.attach((context) => ({
                            upgrade: context.source
                        }))
                    }
                })
            ]
        });
    }
}

// re- think this as the destroyed effect is on the upgrade?

OfficersBlaster.id = 'officer-s-blaster';

module.exports = OfficersBlaster;
