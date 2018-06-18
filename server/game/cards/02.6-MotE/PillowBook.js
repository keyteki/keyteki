const DrawCard = require('../../drawcard.js');

class PillowBook extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Make top card of your conflict deck playable',
            condition: context => context.source.isParticipating() && context.player.conflictDeck.size() > 0,
            effect: 'make the top card of their deck playable until the end of the conflict',
            gameAction: ability.actions.playerLastingEffect(context => ({
                duration: 'lastingEffect',
                until: {
                    onCardMoved: event => event.card === context.player.conflictDeck.first() && event.originalLocation === 'conflict deck',
                    onConflictFinished: () => true,
                    onDeckShuffled: event => event.player === context.player && event.deck === 'conflict deck'
                },
                effect: [
                    ability.effects.showTopConflictCard(),
                    ability.effects.canPlayFromOwn('conflict deck')
                ]
            }))
        });
    }
}

PillowBook.id = 'pillow-book';

module.exports = PillowBook;
