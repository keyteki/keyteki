const Card = require('../../Card.js');

class FOFTransponder extends Card {
    // This creature gains, "Destroyed: Make a token creature. Attach
    // FOF Transponder to that creature."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('destroyed', {
                gameAction: ability.actions.makeTokenCreature(),
                then: {
                    gameAction: ability.actions.attach((context) => ({
                        target: context.preThenEvent.cards[0],
                        // Note: using "this" here to get a pointer to the blaster
                        upgrade: this
                    }))
                }
            })
        });
    }
}

FOFTransponder.id = 'fof-transponder';

module.exports = FOFTransponder;
