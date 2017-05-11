const DrawCard = require('../../../drawcard.js');

class GreyWind extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel Grey Wind to kill a character',
            cost: ability.costs.kneelSelf(),
            phase: 'challenge',
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => this.cardCondition(card),
                gameAction: 'kill'
            },
            handler: context => {
                context.target.controller.killCharacter(context.target);
                this.game.addMessage('{0} kneels {1} to kill {2}', context.player, this, context.target);
            }
        });
    }

    cardCondition(card) {
        var str = this.controller.anyCardsInPlay(card => card.name === 'Robb Stark') ? 2 : 1;

        return card.getStrength() <= str && card.location === 'play area' && card.getType() === 'character';
    }
}

GreyWind.code = '01145';

module.exports = GreyWind;
