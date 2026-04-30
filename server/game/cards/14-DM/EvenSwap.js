const Card = require('../../Card.js');

class EvenSwap extends Card {
    // Play: Give control of two friendly creatures to your opponent, one at a
    // time. If you do, take control of two enemy creatures, one at a time.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                !!context.player.opponent &&
                context.player.creaturesInPlay.length >= 2 &&
                context.player.opponent.creaturesInPlay.length >= 2,
            target: {
                mode: 'exactly',
                numCards: 2,
                activePromptTitle: 'Choose two friendly creatures to give to your opponent',
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'lastingEffect',
                    effect: ability.effects.takeControl(context.player.opponent)
                }))
            },
            effect: 'give control of two friendly creatures to their opponent',
            then: {
                alwaysTriggers: true,
                target: {
                    mode: 'exactly',
                    numCards: 2,
                    activePromptTitle: 'Choose two enemy creatures to take',
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.cardLastingEffect((context) => ({
                        duration: 'lastingEffect',
                        effect: ability.effects.takeControl(context.player)
                    }))
                }
            }
        });
    }
}

EvenSwap.id = 'even-swap';

module.exports = EvenSwap;
