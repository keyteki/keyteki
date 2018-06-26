const DrawCard = require('../../drawcard.js');

class HurricanePunch extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Increase a monk\'s military skill and draw 1 card',
            effect: 'grant 2 military skill to {0} and draw a card',
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: 'character',
                cardCondition: card => card.isParticipating() && card.hasTrait('monk'),
                gameAction: ability.actions.cardLastingEffect(() => ({
                    effect: ability.effects.modifyMilitarySkill(2)
                }))
            },
            gameAction: ability.actions.draw()
        });
    }
}

HurricanePunch.id = 'hurricane-punch';

module.exports = HurricanePunch;
