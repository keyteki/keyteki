const DrawCard = require('../../drawcard.js');

class PillowBook extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Make top card of your conflict deck playable',
            condition: () => this.parent.isParticipating() && this.controller.conflictDeck.size() > 0,
            handler: () => {
                let topCard = this.controller.conflictDeck.first();
                this.game.addMessage('{0} uses {1} to reveal the top card of their conflict deck: {2}', this.controller, this, topCard);
                this.lastingEffect(ability => ({
                    targetType: 'player',
                    until: {
                        onCardMoved: event => event.card === topCard && event.originalLocation === 'conflict deck',
                        onConflictFinished: () => true,
                        onDeckShuffled: event => event.player === this.controller && event.deck === 'conflict deck'
                    },
                    effect: ability.effects.makeTopCardOfConflictDeckPlayable()
                }));
            }
        });
    }
}

PillowBook.id = 'pillow-book';

module.exports = PillowBook;
