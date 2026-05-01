const Card = require('../../Card.js');

class EvenSwap extends Card {
    // Play: Give control of two friendly creatures to your opponent, one at a
    // time. If you do, take control of two enemy creatures, one at a time.
    setupCardAbilities(ability) {
        const giveTarget = () => ({
            mode: 'exactly',
            numCards: (context) => (context.player.creaturesInPlay.length >= 1 ? 1 : 0),
            cardType: 'creature',
            controller: 'self',
            gameAction: ability.actions.cardLastingEffect((context) => ({
                duration: 'lastingEffect',
                effect: ability.effects.takeControl(context.player.opponent)
            }))
        });

        const takeTarget = () => ({
            mode: 'exactly',
            numCards: (context) =>
                context.player.opponent && context.player.opponent.creaturesInPlay.length >= 1
                    ? 1
                    : 0,
            cardType: 'creature',
            controller: 'opponent',
            gameAction: ability.actions.cardLastingEffect((context) => ({
                duration: 'lastingEffect',
                effect: ability.effects.takeControl(context.player)
            }))
        });

        this.play({
            target: giveTarget(),
            effect: 'give control of {0} to {1}',
            effectArgs: (context) => context.player.opponent,
            then: (firstCtx) => ({
                alwaysTriggers: true,
                target: giveTarget(),
                message: '{0} uses {1} to give control of {2} to {3}',
                messageArgs: (context) => context.player.opponent,
                then: (secondCtx) => {
                    const gaveFirst = !!firstCtx.target;
                    const gaveSecond = !!secondCtx.target;
                    if (!(gaveFirst && gaveSecond)) {
                        return { alwaysTriggers: true };
                    }
                    return {
                        alwaysTriggers: true,
                        target: takeTarget(),
                        message: '{0} uses {1} to take control of {2}',
                        then: () => ({
                            alwaysTriggers: true,
                            target: takeTarget(),
                            message: '{0} uses {1} to take control of {2}'
                        })
                    };
                }
            })
        });
    }
}

EvenSwap.id = 'even-swap';

module.exports = EvenSwap;
