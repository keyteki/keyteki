const Card = require('../../Card.js');

class EvenSwap extends Card {
    // Play: Give control of two friendly creatures to your opponent, one at a
    // time. If you do, take control of two enemy creatures, one at a time.
    setupCardAbilities(ability) {
        const giveTarget = (titleSuffix) => ({
            mode: 'exactly',
            numCards: (context) => (context.player.creaturesInPlay.length >= 1 ? 1 : 0),
            activePromptTitle: `Choose ${titleSuffix} friendly creature to give to your opponent`,
            cardType: 'creature',
            controller: 'self',
            gameAction: ability.actions.cardLastingEffect((context) => ({
                duration: 'lastingEffect',
                effect: ability.effects.takeControl(context.player.opponent)
            }))
        });

        this.play({
            target: giveTarget('a'),
            effect: 'give control of friendly creatures to their opponent',
            then: (firstCtx) => ({
                alwaysTriggers: true,
                target: giveTarget('another'),
                then: (secondCtx) => {
                    const gaveFirst = !!firstCtx.target;
                    const gaveSecond = !!secondCtx.target;
                    if (!(gaveFirst && gaveSecond)) {
                        return { alwaysTriggers: true };
                    }
                    return {
                        alwaysTriggers: true,
                        target: {
                            mode: 'upTo',
                            numCards: 2,
                            activePromptTitle: 'Choose enemy creatures to take',
                            cardType: 'creature',
                            controller: 'opponent',
                            gameAction: ability.actions.cardLastingEffect((context) => ({
                                duration: 'lastingEffect',
                                effect: ability.effects.takeControl(context.player)
                            }))
                        }
                    };
                }
            })
        });
    }
}

EvenSwap.id = 'even-swap';

module.exports = EvenSwap;
