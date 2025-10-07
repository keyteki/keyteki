import Card from '../../Card.js';

class FiveC077EvilTwin extends Card {
    // Reap: Destroy another creature with the same power as 5C077. You may give 5C077 a +1 power counter or remove a +1 power counter from 5C077.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                cardCondition: (card, context) =>
                    card !== context.source && card.power === context.source.power,
                gameAction: ability.actions.destroy()
            },
            then: {
                alwaysTriggers: true,
                target: {
                    mode: 'select',
                    choices: {
                        'Add a power counter': ability.actions.addPowerCounter(),
                        'Remove a power counter': ability.actions.removePowerCounter(),
                        Done: () => true
                    }
                }
            }
        });
    }
}

FiveC077EvilTwin.id = '5c077-evil-twin';

export default FiveC077EvilTwin;
