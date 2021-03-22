const Card = require('../../Card.js');

class AnkylosaurusFormation extends Card {
    //Play: Choose one:
    //• A friendly creature gains skirmish for the rest of your turn.
    //• Exalt a friendly creature. Each friendly creature gains skirmish for the rest of your turn.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'exactly',
                numCards: 1,
                cardType: 'creature',
                gameAction: ability.actions.cardLastingEffect({
                    effect: ability.effects.addKeyword({ skirmish: 1 })
                })
            },
            then: (preThenContext) => ({
                may: 'exalt this creature',
                gameAction: ability.actions.exalt({
                    target: preThenContext.target
                }),
                then: {
                    effect: 'give each friendly creature skirmish for the remainder of the turn',
                    gameAction: ability.actions.cardLastingEffect({
                        target: preThenContext.player.creaturesInPlay,
                        effect: ability.effects.addKeyword({
                            skirmish: 1
                        })
                    })
                }
            })
        });
    }
}

AnkylosaurusFormation.id = 'ankylosaurus-formation';

module.exports = AnkylosaurusFormation;
