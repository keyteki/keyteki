const Card = require('../../Card.js');

class OfficersBlaster extends Card {
    // This creature gets +2 power.
    // This creature gains, “Destroyed: Attach Officer’s Blaster to this creature's right neighbor.”
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.modifyPower(2),
                ability.effects.gainAbility('destroyed', {
                    target: {
                        cardType: 'creature',
                        numCards: 1,
                        cardCondition: (card, context) => {
                            let neighbors = context.source.neighbors;

                            if (neighbors.length == 0) {
                                // no neighbors so card matches ever
                                return false;
                            } else if (neighbors.length == 1) {
                                // if there is 1 neighbor, check if that neighor is on the left or right
                                let creatures = context.source.controller.creaturesInPlay;
                                if (
                                    creatures.indexOf(neighbors[0]) >
                                    creatures.indexOf(context.source)
                                ) {
                                    return card == neighbors[0];
                                }
                            } else if (neighbors.length == 2) {
                                return card == neighbors[1];
                            }

                            return false;
                        },

                        gameAction: ability.actions.attach(() => ({
                            // note, using "this" here to get a pointer to the blaster
                            upgrade: this
                        }))
                    }
                })
            ]
        });
    }
}
OfficersBlaster.id = 'officer-s-blaster';

module.exports = OfficersBlaster;
