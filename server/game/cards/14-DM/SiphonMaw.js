const Card = require('../../Card.js');

class SiphonMaw extends Card {
    // After Fight/After Reap: Discard the top card of a player's deck.
    // For each bonus icon on the discarded card, your opponent loses 1.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                mode: 'select',
                activePromptTitle: "Choose a player's deck to discard the top card of",
                choices: {
                    Mine: (context) => context.player.deck.length > 0,
                    Opponent: (context) =>
                        !!context.player.opponent && context.player.opponent.deck.length > 0
                }
            },
            effect: 'discard the top card of {1}',
            effectArgs: (context) =>
                context.select === 'Mine' ? 'their deck' : "their opponent's deck",
            gameAction: ability.actions.discard((context) => {
                const owner = context.select === 'Mine' ? context.player : context.player.opponent;
                const card = owner ? owner.deck[0] : null;
                if (card) {
                    context.source.siphonedCard = card;
                }
                return {
                    location: 'deck',
                    target: card ? [card] : []
                };
            }),
            then: {
                alwaysTriggers: true,
                condition: (context) => {
                    const card = context.source.siphonedCard;
                    return !!card && card.bonusIcons && card.bonusIcons.length > 0;
                },
                gameAction: ability.actions.loseAmber((context) => ({
                    amount:
                        context.source.siphonedCard && context.source.siphonedCard.bonusIcons
                            ? context.source.siphonedCard.bonusIcons.length
                            : 0
                }))
            }
        });
    }
}

SiphonMaw.id = 'siphon-maw';

module.exports = SiphonMaw;
