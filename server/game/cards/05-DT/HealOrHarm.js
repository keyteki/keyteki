import Card from '../../Card.js';

class HealOrHarm extends Card {
    // Play: Choose one:
    // • Fully heal a creature and gain 1A.
    // • Ready and fight with a friendly creature.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        Heal: () => true,
                        Harm: () => true
                    }
                },
                Heal: {
                    dependsOn: 'action',
                    cardType: 'creature',
                    controller: 'any',
                    gameAction: ability.actions.sequential([
                        ability.actions.gainAmber((context) => ({
                            target: context.player
                        })),
                        ability.actions.heal({ fully: true })
                    ])
                },
                Harm: {
                    dependsOn: 'action',
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.sequential([
                        ability.actions.ready(),
                        ability.actions.fight()
                    ])
                }
            }
        });
    }
}

HealOrHarm.id = 'heal-or-harm';

export default HealOrHarm;
