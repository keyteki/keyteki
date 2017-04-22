const DrawCard = require('../../../drawcard.js');

class OldBearMormont extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.anyCardsInPlay(card => card.name === 'The Wall'),
            match: this,
            effect: ability.effects.doesNotKneelAsDefender()
        });
        this.interrupt({
            when: {
                onPhaseEnded: (event, phase) => phase === 'challenge' && this.controller.getNumberOfChallengesLost('defender') === 0
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    cardCondition: card => card.location === 'hand' && card.controller === this.controller && card.isFaction('thenightswatch'),
                    activePromptTitle: 'Select character',
                    source: this,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        player.putIntoPlay(card);

        this.game.addMessage('{0} uses {1} to put {2} into play from their hand', player, this, card);

        return true;
    }
}

OldBearMormont.code = '01126';

module.exports = OldBearMormont;
