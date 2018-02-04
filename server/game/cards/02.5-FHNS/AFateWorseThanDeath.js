const DrawCard = require('../../drawcard.js');

class AFateWorseThanDeath extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow, move home, dishonor, remove a fate and blank a character',
            target: {
                cardType: 'character',
                cardCondition: card => card.isParticipating()
            },
            handler: context => {
                this.game.addMessage('{0} plays {1}, bowing, dishonoring, removing a fate from, blanking, and moving {2} home', this.controller, this, context.target);
                let events = [];
                if(context.target.allowGameAction('bow', context)) {
                    events.push({
                        name: 'onCardBowed',
                        params: { card: context.target, source: this, gameAction: 'bow' },
                        handler: () => context.target.bow()
                    });
                }
                if(context.target.allowGameAction('dishonor', context)) {
                    events.push({
                        name: 'onCardDishonored',
                        params: { card: context.target, source: this, gameAction: 'dishonor' },
                        handler: () => context.target.dishonor()
                    });
                }
                if(context.target.allowGameAction('removeFate', context)) {
                    events.push({
                        name: 'onCardRemoveFate',
                        params: { card: context.target, fate: 1, source: this, gameAction: 'removeFate' }
                    });
                }
                if(context.target.allowGameAction('sendHome', context)) {
                    events.push({
                        // TODO: really should have a conditional 'onCharactersSentHome' event here also
                        name: 'onSendHome',
                        params: { card: context.target, source: this, gameAction: 'sendHome' },
                        handler: () => this.game.currentConflict.removeFromConflict(context.target)
                    });
                }
                events.push({
                    name: 'unnamedEvent',
                    params: { order: 1 },
                    handler: () => this.untilEndOfPhase(ability => ({
                        match: context.target,
                        effect: ability.effects.blank
                    }))
                });
                this.game.raiseMultipleEvents(events);
            }
        });
    }
}

AFateWorseThanDeath.id = 'a-fate-worse-than-death';

module.exports = AFateWorseThanDeath;
