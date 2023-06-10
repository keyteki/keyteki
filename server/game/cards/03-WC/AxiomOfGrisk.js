const Card = require('../../Card.js');

class AxiomOfGrisk extends Card {
    // Play: Ward a creature. Destroy each creature with no A on it. Gain 2 chains.
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a creature to ward',
                cardType: 'creature',
                gameAction: ability.actions.sequential([
                    ability.actions.ward(),
                    ability.actions.destroy((context) => ({
                        target: context.game.creaturesInPlay.filter(
                            (card) => !card.hasToken('amber')
                        )
                    }))
                ])
            },
            effect: 'ward {0}, destroy all creatures without amber and give {1} 2 chains',
            effectArgs: (context) => context.player,
            gameAction: ability.actions.gainChains({ amount: 2 })
        });
    }
}

AxiomOfGrisk.id = 'axiom-of-grisk';

module.exports = AxiomOfGrisk;
