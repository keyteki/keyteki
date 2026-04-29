const Card = require('../../Card.js');

class EdictOfNerotaurus extends Card {
    // After a creature reaps, the next creature used this turn cannot reap.
    //
    // After a creature fights, the next creature used this turn cannot fight.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onUseCard: (event) => event.reapEvent
            },
            gameAction: ability.actions.lastingEffect(() => ({
                until: {
                    onUseCard: (event) => event.card.type === 'creature',
                    onTurnEnd: () => true
                },
                targetController: 'any',
                effect: ability.effects.cardCannot('reap')
            }))
        });

        this.reaction({
            when: {
                onUseCard: (event) => event.fightEvent
            },
            gameAction: ability.actions.lastingEffect(() => ({
                until: {
                    onUseCard: (event) => event.card.type === 'creature',
                    onTurnEnd: () => true
                },
                targetController: 'any',
                effect: ability.effects.cardCannot('fight')
            }))
        });
    }
}

EdictOfNerotaurus.id = 'edict-of-nerotaurus';

module.exports = EdictOfNerotaurus;
