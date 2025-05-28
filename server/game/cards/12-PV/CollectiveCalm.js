const Card = require('../../Card.js');

class CollectiveCalm extends Card {
    // Each creature gains, “After Reap: Gain 1A.”
    // After a friendly creature is used to fight, destroy Collective Calm.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card) => card.type === 'creature',
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.gainAmber()
            })
        });

        this.reaction({
            when: {
                onUseCard: (event, context) =>
                    event.fightEvent &&
                    event.fightEvent.attackerClone.type === 'creature' &&
                    event.fightEvent.attackerClone.controller === context.source.controller
            },
            gameAction: ability.actions.destroy()
        });
    }
}

CollectiveCalm.id = 'collective-calm';

module.exports = CollectiveCalm;
