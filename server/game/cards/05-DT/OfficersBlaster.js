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
                        // note, context.source here is the creature that was upgraded, not this upgrade
                        cardCondition: (card, context) => card === context.source.rightNeighbor,
                        gameAction: ability.actions.attach((context) => ({
                            // note, the context here is from the context of the creature - not the upgrade
                            // to avoid using "this" looking up the upgrade on the create
                            upgrade: context.source.upgrades.find(
                                (upgrade) => upgrade.name === "Officer's Blaster"
                            )
                        }))
                    }
                })
            ]
        });
    }
}
OfficersBlaster.id = 'officer-s-blaster';

module.exports = OfficersBlaster;
