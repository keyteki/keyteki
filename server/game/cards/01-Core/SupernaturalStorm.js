const DrawCard = require('../../drawcard.js');

class SupernaturalStorm extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Increase the skill of one character',
            condition: () => this.controller.cardsInPlay.any(card => card.hasTrait('shugenja')),
            target: {
                cardType: 'character',
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.cardLastingEffect(context => ({
                    effect: ability.effects.modifyBothSkills(context.player.cardsInPlay.reduce((total, card) => total + (card.hasTrait('shugenja') ? 1 : 0), 0))
                }))
            },
            effect: 'imbue {0} with the supernatural power of the storm!'
        });
    }
}

SupernaturalStorm.id = 'supernatural-storm';

module.exports = SupernaturalStorm;
