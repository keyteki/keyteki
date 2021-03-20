const Card = require('../../Card.js');

class HealOrHarm extends Card {
    //Play: Choose one:
    //• Fully heal a creature and gain 1A.
    //• Ready and fight with a friendly creature.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.game.creaturesInPlay.length > 0,
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        Heal: () => true,
                        Harm: () => true
                    }
                },
                healCreature: {
                    dependsOn: 'action',
                    targetCondition: (context) => context.selects.action.choice === 'Heal',
                    gameAction: ability.actions.sequential([
                        ability.actions.gainAmber((context) => ({
                            target: context.player
                        })),
                        ability.actions.heal((context) => ({
                            fully: true,
                            target: context.player.creaturesInPlay
                        }))
                    ])
                },
                harmCreature: {
                    dependsOn: 'action',
                    targetCondition: (context) => context.selects.action.choice === 'Harm',
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

module.exports = HealOrHarm;
