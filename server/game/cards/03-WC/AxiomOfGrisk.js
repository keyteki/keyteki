const Card = require('../../Card.js');

class AxiomOfGrisk extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a creature to ward',
                cardType: 'creature',
                gameAction: ability.actions.ward()
            },
            then: {
                gameAction: ability.actions.sequential([
                    ability.actions.gainChains({ amount: 2 }),
                    ability.actions.destroy(context => ({ target: context.game.creaturesInPlay.filter(card => !card.hasToken('amber')) }))
                ])
            },
            effect: 'ward {0} and destroy each creature with no amber on it. Gain 2 chains.'
        });
    }
}

AxiomOfGrisk.id = 'axiom-of-grisk';

module.exports = AxiomOfGrisk;
