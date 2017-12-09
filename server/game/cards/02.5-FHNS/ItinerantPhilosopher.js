const DrawCard = require('../../drawcard.js');

class ItinerantPhilosopher extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow a character',
            condition: () => this.game.currentConflict && this.game.currentConflict.isParticipating(this),
            cost: ability.costs.discardImperialFavor(),
            target: {
                activePromptTitle: 'Choose an opposing character',
                cardType: 'character',
                cardCondition: card => this.game.currentConflict.isParticipating(card) &&
                  card.controller === this.controller.opponent && card.attachments._wrapped.length > 0
            },
            handler: context => {
                this.game.addMessage('{0} discards the Imperial Favor to use {1}, bowing {2}', this.controller, this, context.target);
                this.controller.bowCard(context.target, this);
            }
        });
    }
}

ItinerantPhilosopher.id = 'itinerant-philosopher';

module.exports = ItinerantPhilosopher;
