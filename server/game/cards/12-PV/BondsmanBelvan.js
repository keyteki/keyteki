const Card = require('../../Card.js');

class BondsmanBelvan extends Card {
    // After Fight/After Reap: Look at the top card of your opponent's deck. You may discard it.
    // Fate: Give control of a friendly artifact to your opponent.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            effect: "look at the top card of their opponent's deck and may discard it",
            condition: (context) =>
                context.player.opponent && context.player.opponent.deck.length > 0,
            gameAction: ability.actions.discard((context) => ({
                promptWithHandlerMenu: {
                    optional: true,
                    activePromptTitle: 'Do you want to discard this card?',
                    choices: ['Leave on top of deck'],
                    handlers: [() => []],
                    cards: [context.player.opponent ? context.player.opponent.deck[0] : undefined]
                }
            }))
        });

        this.fate({
            target: {
                cardType: 'artifact',
                controller: 'opponent',
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'lastingEffect',
                    effect: ability.effects.takeControl(context.game.activePlayer.opponent)
                }))
            }
        });
    }
}

BondsmanBelvan.id = 'bondsman-belvan';

module.exports = BondsmanBelvan;
