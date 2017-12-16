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
                this.game.raiseMultipleEvents([
                    {
                        name: 'onCardBowed',
                        params: { card: context.target, source: this, gameAction: 'bow' },
                        handler: () => {
                            return { resolved: true, success: context.target.bow() };
                        }
                    },
                    {
                        name: 'onCardDishonored',
                        params: { card: context.target, source: this, gameAction: 'dishonor' },
                        handler: () => {
                            return { resolved: true, success: context.target.dishonor() };
                        }                     
                    },
                    {
                        name: 'onCardRemoveFate',
                        params: { card: context.target, fate: 1, source: this, gameAction: 'removeFate' },
                    },
                    {
                        // TODO: really should have a conditional 'onCharactersSentHome' event here also
                        name: 'onSendHome',
                        params: { card: context.target, source: this, gameAction: 'sendHome' },
                        handler: () => this.game.currentConflict.removeFromConflict(context.target)
                    },
                    {
                        name: 'unnamedEvent',
                        params: { order: 1 },
                        handler: () => this.untilEndOfPhase(ability => ({
                            match: context.target,
                            effect: ability.effects.blank
                        }))
                    }
                ]);
            }
        });
    }
}

AFateWorseThanDeath.id = 'a-fate-worse-than-death';

module.exports = AFateWorseThanDeath;
