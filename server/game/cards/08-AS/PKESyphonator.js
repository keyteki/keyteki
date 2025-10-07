import Card from '../../Card.js';

class PKESyphonator extends Card {
    // Play: Gain 1A for each card in your opponent’s archives. Your
    // opponent discards each card in their archives.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect: "gain {1} amber, and discard all cards in {2}'s archives",
            effectArgs: (context) => [
                context.player.opponent.archives.length,
                context.player.opponent
            ],
            gameAction: [
                ability.actions.gainAmber((context) => ({
                    amount: context.player.opponent.archives.length
                })),
                ability.actions.discard((context) => ({
                    target: context.player.opponent.archives
                }))
            ]
        });
    }
}

PKESyphonator.id = 'pke-syphonator';

export default PKESyphonator;
