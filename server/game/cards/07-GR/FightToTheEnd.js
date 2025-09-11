const Card = require('../../Card.js');

class FightToTheEnd extends Card {
    // Play: Choose a friendly creature. If you are haunted, that
    // creature gains skirmish. Ready and fight with that creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.conditional({
                    condition: (context) => context.player.isHaunted(),
                    trueGameAction: ability.actions.cardLastingEffect({
                        duration: 'lastingEffect',
                        effect: ability.effects.addKeyword({ skirmish: 1 })
                    })
                })
            },
            effect: '{1}ready and fight with {0}',
            effectArgs: (context) =>
                context.player.isHaunted()
                    ? 'give ' + context.target.name + ' skirmish until it leaves play, then '
                    : '',
            then: (preThenContext) => ({
                alwaysTriggers: true,
                gameAction: ability.actions.sequential([
                    ability.actions.ready({
                        target: preThenContext.target
                    }),
                    ability.actions.fight({
                        target: preThenContext.target
                    })
                ])
            })
        });
    }
}

FightToTheEnd.id = 'fight-to-the-end';

module.exports = FightToTheEnd;
