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
                let actions = {
                    bow: context.target,
                    dishonor: context.target,
                    removeFate: context.target,
                    sendHome: context.target
                };
                this.game.applyGameAction(context, actions, [{ params: { order: 1 }, handler: () => this.untilEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.blank
                }))}]);
            }
        });
    }
}

AFateWorseThanDeath.id = 'a-fate-worse-than-death';

module.exports = AFateWorseThanDeath;
