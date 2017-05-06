const DrawCard = require('../../../drawcard.js');

class MarriagePact extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cannotParticipate()
        });

        this.forcedInterrupt({
            when: {
                onCardLeftPlay: event => event.card === this.parent
            },
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => (
                    card.location === 'play area' && 
                    card.controller === this.controller &&
                    card.getType() === 'character')
            },
            handler: context => {
                context.target.controller.sacrificeCard(context.target);
                this.game.addMessage('{0} is forced by {1} to sacrifice {2}', context.player, this, context.target);
            }
        });
    }
}

MarriagePact.code = '06022';

module.exports = MarriagePact;
