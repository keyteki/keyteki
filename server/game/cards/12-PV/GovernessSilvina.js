import Card from '../../Card.js';

class GovernessSilvina extends Card {
    // Play: Move each A from a friendly creature to the most powerful enemy creature.
    // Scrap: Stun 2 creatures with no on them.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent && context.player.opponent.creaturesInPlay.length > 0,
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.removeAmber({
                    all: true
                })
            },
            then: {
                gameAction: ability.actions.placeAmber((context) => ({
                    amount: context.preThenEvent.amount,
                    promptForSelect: {
                        message: '{0} uses {1} to place amber on {2}',
                        messageArgs: (card) => [context.player, context.source, card],
                        cardType: 'creature',
                        controller: 'opponent',
                        activePromptTitle: 'Choose the most powerful enemy creature',
                        mode: 'mostStat',
                        numCards: 1,
                        cardStat: (card) => card.power
                    }
                }))
            }
        });

        this.scrap({
            target: {
                cardType: 'creature',
                mode: 'exactly',
                numCards: 2,
                cardCondition: (card) => !card.tokens.amber,
                gameAction: ability.actions.stun()
            }
        });
    }
}

GovernessSilvina.id = 'governess-silvina';

export default GovernessSilvina;
