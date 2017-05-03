const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class JoryCassel extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            canCancel: true,
            when: {
                onCharactersKilled: event => event.allowSave
            },
            target: {
                activePromptTitle: 'Select a character to save',
                cardCondition: (card, context) => (
                    context.event.cards.includes(card) &&
                    card.controller === this.controller &&
                    card.isUnique() &&
                    card.isFaction('stark')
                )
            },
            handler: context => {
                let message = '{0} uses {1} to save {2}';
                let toKill = context.target;

                context.event.saveCard(toKill);
                this.controller.sacrificeCard(this);

                if(_.any(this.game.getPlayers(), player => {
                    return player.activePlot.hasTrait('Winter');
                })) {
                    toKill.modifyPower(1);

                    message += ' and make it gain 1 power';
                }

                this.game.addMessage(message, this.controller, this, toKill);
            }
        });
    }
}

JoryCassel.code = '03008';

module.exports = JoryCassel;
