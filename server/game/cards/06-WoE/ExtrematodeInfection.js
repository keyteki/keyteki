import Card from '../../Card.js';

class ExtrematodeInfection extends Card {
    //Play: Put 3 hatch counters on Extrematode Infection.
    // At the start of your turn, remove 1 hatch counter from Extrematode Infection.
    // Then if it has no hatch counters, destroy this creature and make 3 token creatures.
    setupCardAbilities(ability) {
        this.play({
            effect: 'put 3 hatch counters on {0}',
            gameAction: ability.actions.addHatchCounter(() => ({
                amount: 3,
                target: this
            }))
        });

        this.reaction({
            when: {
                onBeginRound: (event, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.removeHatchCounter(() => ({
                target: this
            })),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.sequential([
                    ability.actions.destroy(() => ({
                        target: !this.hasToken('hatch') ? this.parent : []
                    })),
                    ability.actions.makeTokenCreature(() => ({
                        amount: !this.hasToken('hatch') ? 3 : 0
                    }))
                ])
            }
        });
    }
}

ExtrematodeInfection.id = 'extrematode-infection';

export default ExtrematodeInfection;
