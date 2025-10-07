import Card from '../../Card.js';

class OfficersBlaster extends Card {
    // This creature gets +2 power.
    // This creature gains, “Destroyed: Attach Officer’s Blaster to this creature's right neighbor.”
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.modifyPower(2),
                ability.effects.gainAbility('destroyed', {
                    gameAction: ability.actions.attach((context) => ({
                        target: context.source.rightNeighbor(),
                        // note, using "this" here to get a pointer to the blaster
                        upgrade: this
                    }))
                })
            ]
        });
    }
}
OfficersBlaster.id = 'officer-s-blaster';

export default OfficersBlaster;
