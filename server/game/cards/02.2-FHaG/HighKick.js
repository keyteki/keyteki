const DrawCard = require('../../drawcard.js');

class HighKick extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow and Disable a character',
            condition: () => this.game.isDuringConflict('military'),
            cost: ability.costs.bow(card => card.hasTrait('monk') && card.isParticipating()),
            target: {
                cardType: 'character',
                controller: 'opponent',
                cardCondition: card => card.isParticipating(),
                gameAction: [
                    ability.actions.bow(), 
                    ability.actions.cardLastingEffect({ effect: ability.effects.cardCannot('triggerAbilities') })
                ]
            },
            effect: 'bow {0} and prevent them from using abilities'
        });
    }
}

HighKick.id = 'high-kick';

module.exports = HighKick;
