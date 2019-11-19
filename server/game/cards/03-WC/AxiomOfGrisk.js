const Card = require('../../Card.js');

class AxiomOfGrisk extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a creature to ward',
                cardType: 'creature',
                gameAction: ability.actions.sequential([
                    ability.actions.ward(),
                    ability.actions.destroy(context => ({ target: context.game.creaturesInPlay.filter(card => !card.hasToken('amber')) }))
                ])
            },
            effectStyle: 'append',
            gameAction: ability.actions.gainChains({ amount: 2 })
        });
    }
}

AxiomOfGrisk.id = 'axiom-of-grisk';

module.exports = AxiomOfGrisk;
