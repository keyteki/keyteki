const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class KingRobertsWarhammer extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(1)
        });
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.winner === this.controller && challenge.isAttacking(this.parent)
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    numCards: 99,
                    activePromptTitle: 'Select characters',
                    source: this,
                    maxStat: () => this.parent.getStrength(),
                    cardStat: card => card.getStrength(),
                    cardCondition: card => card.location === 'play area' && card.getType() === 'character' && !card.kneeled,
                    onSelect: (player, cards) => this.onSelect(player, cards),
                    onCancel: (player) => this.cancelSelection(player)
                });
            }
        });
    }

    onSelect(player, cards) {
        _.each(cards, card => {
            card.controller.kneelCard(card);
        });

        this.game.addMessage('{0} sacrifices {1} to kneel {2}', player, this, cards);
        this.controller.sacrificeCard(this);

        return true;
    }

    cancelSelection(player) {
        this.game.addMessage('{0} cancels the resolution of {1}', player, this);
    }
}

KingRobertsWarhammer.code = '02008';

module.exports = KingRobertsWarhammer;
