const DrawCard = require('../../drawcard.js');

class ArtisanAcademy extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Make top card of conflict deck playable',
            phase: 'conflict',
            condition: context => context.player.conflictDeck.size() > 0,
            effect: 'reveal the top card of their conflict deck',
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

ArtisanAcademy.id = 'artisan-academy';

module.exports = ArtisanAcademy;
