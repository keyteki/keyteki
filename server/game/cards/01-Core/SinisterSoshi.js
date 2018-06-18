const DrawCard = require('../../drawcard.js');

class SinisterSoshi extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give a character -2/-2',
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: 'character',
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.cardLastingEffect({ effect: ability.effects.modifyBothSkills(-2) })
            },
            effect: 'give {0} -2{1}/-2{2}',
            effectArgs: () => ['military', 'political']
        });
    }
}

SinisterSoshi.id = 'sinister-soshi';

module.exports = SinisterSoshi;
