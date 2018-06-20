const DrawCard = require('../../drawcard.js');

class PillowBook extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Make top card of your conflict deck playable',
            condition: context => context.source.parent.isParticipating() && context.player.conflictDeck.size() > 0,
            effect: 'make the top card of their deck playable until the end of the conflict',
            gameAction: ability.actions.playerLastingEffect(context => {
                let topCard = context.player.conflictDeck.first();
                return {
                    duration: 'lastingEffect',
                    until: {
                        onCardMoved: event => event.card === topCard && event.originalLocation === 'conflict deck',
                        onPhaseEnded: event => event.phase === 'conflict',
                        onDeckShuffled: event => event.player === context.player && event.deck === 'conflict deck'
                    },
                    effect: [
                        ability.effects.showTopConflictCard(),
                        ability.effects.canPlayFromOwn('conflict deck')
                    ]
                };
            })
        });
    }
}

PillowBook.id = 'pillow-book';

module.exports = PillowBook;
