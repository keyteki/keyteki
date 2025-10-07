import Card from '../../Card.js';

class EffigyOfMelerukh extends Card {
    // After an enemy creature reaps, put an awakening counter on Effigy of Melerukh.
    // If there are 6 or more awakening counters on Effigy of Melerukh, move it to a flank of your battleline as a creature with 100 power and 100 armor. Its text box is considered blank.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onReap: (event, context) =>
                    event.card.controller !== context.player &&
                    event.card.type === 'creature' &&
                    context.source.type === 'artifact'
            },
            gameAction: ability.actions.addAwakeningCounter(),
            then: {
                condition: (context) =>
                    context.source.hasToken('awakening') && context.source.tokens.awakening >= 6,
                message: '{1} has 6 counters and moves to flank.',
                messageArgs: (context) => [context.source],
                gameAction: ability.actions.sequential([
                    ability.actions.cardLastingEffect((context) => ({
                        target: context.source,
                        duration: 'lastingEffect',
                        effect: [
                            ability.effects.changeType('creature'),
                            ability.effects.modifyPower(100),
                            ability.effects.modifyArmor(100),
                            ability.effects.blank()
                        ]
                    })),
                    ability.actions.moveToFlank()
                ])
            }
        });
    }
}

EffigyOfMelerukh.id = 'effigy-of-melerukh';

export default EffigyOfMelerukh;
