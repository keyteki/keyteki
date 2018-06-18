const DrawCard = require('../../drawcard.js');

class IdeTadaji extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move characters into conflict',
            condition: context => context.source.isParticipating(),
            targets: {
                myChar: {
                    cardType: 'character',
                    controller: 'self',
                    cardCondition: card => !card.bowed && card.getCost() <= 2,
                    gameAction: ability.actions.moveToConflict()
                },
                oppChar: {
                    cardType: 'character',
                    controller: 'opponent',
                    cardCondition: card => !card.bowed && card.getCost() <= 2,
                    gameAction: ability.actions.moveToConflict()
                }
            }
        });
    }
}

IdeTadaji.id = 'ide-tadaji';

module.exports = IdeTadaji;
