const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class GrowingStrong extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give +2 STR to up to 3 characters',
            phase: 'challenge',
            target: {
                numCards: 3,
                activePromptTitle: 'Select up to three Tyrell characters',
                cardCondition: card => card.isFaction('tyrell') && card.getType() === 'character'
            },
            handler: context => {
                _.each(context.target, card => {
                    card.untilEndOfPhase(ability => ({
                        match: card,
                        effect: ability.effects.modifyStrength(2)
                    }));
                });
                this.game.addMessage('{0} uses {1} to give +2 STR to {2}', context.player, this, context.target);
            }
        });
    }
}

GrowingStrong.code = '01195';

module.exports = GrowingStrong;
