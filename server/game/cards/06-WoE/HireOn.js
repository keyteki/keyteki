import Card from '../../Card.js';

class HireOn extends Card {
    // Play: Make a token creature. If there is a combined total of 6
    // Aember or more between both players' pools, archive Hire On.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.sequential([
                ability.actions.makeTokenCreature(),
                ability.actions.conditional({
                    condition: (context) =>
                        context.player.amber +
                            (context.player.opponent ? context.player.opponent.amber : 0) >=
                        6,
                    trueGameAction: ability.actions.archive((context) => ({
                        effect: 'archive {1}',
                        target: context.source
                    }))
                })
            ]),
            effect: 'make a token creature{1}{2}',
            effectArgs: (context) =>
                context.player.amber +
                    (context.player.opponent ? context.player.opponent.amber : 0) >=
                6
                    ? [' and archive ', context.source]
                    : ['', '']
        });
    }
}

HireOn.id = 'hire-on';

export default HireOn;
