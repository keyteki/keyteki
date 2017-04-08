const DrawCard = require('../../../drawcard.js');

class Confinement extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Remove icons from character',
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => this.cardCondition(card)
            },
            handler: context => {
                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    effect: [
                        ability.effects.removeIcon('military'),
                        ability.effects.removeIcon('intrigue'),
                        ability.effects.removeIcon('power')
                    ]
                }));
            }
        });
    }

    cardCondition(card) {
        return card.location === 'play area' && card.getType() === 'character' && card.getStrength() <= 4;
    }
}

Confinement.code = '01121';

module.exports = Confinement;
