const DrawCard = require('../../drawcard.js');

class KitsuSpiritcaller extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Resurrect a character',
            condition: () => this.game.currentConflict,
            cost: ability.costs.bowSelf(),
            target: {
                activePrompt: 'Choose a character from a discard pile',
                cardType: 'character',
                gameAction: 'putIntoConflict',
                cardCondition: card => (card.location === 'dynasty discard pile' || card.location === 'conflict discard pile') && card.controller === this.controller
            },
            handler: context => {
                this.game.addMessage('{0} bows {1} to call {2} back from the dead until the end of the conflict', this.controller, this, context.target);
                let event = this.game.applyGameAction(context, { putIntoConflict: context.target })[0];
                event.addThenEvent(this.game.getEvent('unnamedEvent', {}, () => this.delayedEffect({
                    match: context.target,
                    trigger: 'onConflictFinished',
                    context: context,
                    effectFunc: (card, context) => {
                        this.game.addMessage('{0} returns to the bottom of the deck due to {1}\'s effect', context.target, context.source);
                        let events = this.game.getEventsForGameAction('returnToDeck', card, context);
                        events[0].options.bottom = true;
                        return events;
                    }
                })));
            }
        });
    }
}

KitsuSpiritcaller.id = 'kitsu-spiritcaller';

module.exports = KitsuSpiritcaller;
