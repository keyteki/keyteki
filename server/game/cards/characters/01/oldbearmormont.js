const DrawCard = require('../../../drawcard.js');

class OldBearMormont extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.cardsInPlay.any(card => card.name === 'The Wall'),
            match: this,
            effect: ability.effects.doesNotKneelAsDefender()
        });
        this.interrupt({
            when: {
                onPhaseEnded: (event, phase) => phase === 'challenge' && this.controller.getNumberOfChallengesLost('defender') === 0
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    cardCondition: card => card.location === 'hand' && card.controller === this.controller && card.getFaction() === 'thenightswatch',
                    activePromptTitle: 'Select character',
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        player.moveCard(card, 'play area');

        this.game.addMessage('{0} uses {1} to put {2} into play from their hand', player, this, card);

        return true;
    }
}

OldBearMormont.code = '01126';

module.exports = OldBearMormont;
