import Card from '../../Card.js';

class ShrewdInvestor extends Card {
    // Play: You may have your opponent gain 1Aember. If you do,
    // capture 4Aember.
    setupCardAbilities(ability) {
        this.play({
            optional: true,
            gameAction: ability.actions.sequential([
                ability.actions.gainAmber((context) => ({
                    target: context.player.opponent
                })),
                ability.actions.capture({ amount: 4 })
            ]),
            message: '{0} uses {1} to cause {2} to gain 1 amber, and then capture 4 amber',
            messageArgs: (context) => [context.player, this, context.player.opponent]
        });
    }
}

ShrewdInvestor.id = 'shrewd-investor';

export default ShrewdInvestor;
