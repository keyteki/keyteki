import Card from '../../Card.js';

class WatchedClosely extends Card {
    // This creature gains, “After Reap: Your opponent makes a token creature.”
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.gainAbility('reap', {
                    condition: (context) => !!context.player.opponent,
                    gameAction: ability.actions.makeTokenCreature((context) => ({
                        player: context.player.opponent
                    })),
                    effect: 'have {1} make a token creature',
                    effectArgs: (context) => [context.player.opponent]
                })
            ]
        });
    }
}

WatchedClosely.id = 'watched-closely';

export default WatchedClosely;
