const Card = require('../../Card.js');

class Hypothesize extends Card {
    // Play: Make a token creature. If there are three or more
    // friendly Logos cards in play, archive Hypothesize.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.sequential([
                ability.actions.makeTokenCreature(),
                ability.actions.conditional({
                    condition: (context) =>
                        context.game.cardsInPlay.reduce(
                            (total, card) =>
                                total +
                                card.upgrades
                                    .concat(card)
                                    .filter(
                                        (c) =>
                                            c.hasHouse('logos') && c.controller === context.player
                                    ).length,
                            0
                        ) >= 3,
                    trueGameAction: ability.actions.archive((context) => ({
                        effect: 'archive {1}',
                        target: context.source
                    }))
                })
            ]),
            effect: 'make a token creature{1}{2}',
            effectArgs: (context) =>
                context.game.cardsInPlay.reduce(
                    (total, card) =>
                        total +
                        card.upgrades
                            .concat(card)
                            .filter((c) => c.hasHouse('logos') && c.controller === context.player)
                            .length,
                    0
                ) >=
                3 -
                    (context.player.tokenCard &&
                    context.player.tokenCard.hasHouse('logos') &&
                    context.player.deck.length > 0
                        ? 1
                        : 0)
                    ? [' and archive ', context.source]
                    : ['', '']
        });
    }
}

Hypothesize.id = 'hypothesize';

module.exports = Hypothesize;
