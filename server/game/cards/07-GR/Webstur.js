const Card = require('../../Card.js');

class Webstur extends Card {
    // After Fight: For each damage on Webstur, you may discard the top card
    // of each player's deck.
    setupCardAbilities(ability) {
        this.discards = 0;

        this.fight({
            condition: (context) => {
                this.discards = 0;
                return this.discards < context.source.tokens.damage;
            },
            effect:
                "choose whether to discard cards from each player's deck for each damage on {0}",
            then: {
                alwaysTriggers: true,
                condition: (context) => this.discards < context.source.tokens.damage,
                may: "discard the top card from each player's deck",
                gameAction: ability.actions.discard((context) => ({
                    target: context.player.deck
                        .slice(0, 1)
                        .concat(
                            context.player.opponent ? context.player.opponent.deck.slice(0, 1) : []
                        )
                })),
                then: (context) => ({
                    condition: () => {
                        this.discards++;
                        return true;
                    },
                    messageArgs: (context) => [context.preThenEvents.map((e) => e.card)],
                    gameAction: ability.actions.resolveAbility({ ability: context.ability })
                })
            }
        });
    }
}

Webstur.id = 'webstur';

module.exports = Webstur;
