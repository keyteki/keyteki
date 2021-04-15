const Card = require('../../Card.js');

class RuinsOfArchonis extends Card {
    // Play: Put  4A on Ruins of Archonis from the common supply. Archive a card.
    // After a player plays their 6th card in a turn, if Ruins of Archonis is ready, move each A from Ruins of Archonis to that player's pool.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.archive()
            },
            gameAction: ability.actions.placeAmber({
                amount: 4,
                target: this
            })
        });

        this.reaction({
            when: {
                onCardPlayed: (_, context) =>
                    context.game.cardsPlayed.length === 6 && !context.source.exhausted
            },
            gameAction: ability.actions.removeAmber({ all: true }),
            then: {
                gameAction: ability.actions.gainAmber((context) => ({
                    amount: context.preThenEvent.amount,
                    target: context.game.activePlayer
                }))
            }
        });
    }
}

RuinsOfArchonis.id = 'ruins-of-archonis';

module.exports = RuinsOfArchonis;
