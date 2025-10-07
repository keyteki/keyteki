import Card from '../../Card.js';

class AnkyloFormation extends Card {
    // Play: Choose one:
    // • For the remainder of the turn, a friendly creature gains skirmish.
    // • Exalt a friendly creature. For the remainder of the turn, each friendly creature gains skirmish.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        Skirmish: () => true,
                        Exalt: () => true
                    }
                },
                Skirmish: {
                    dependsOn: 'action',
                    controller: 'self',
                    mode: 'exactly',
                    numCards: 1,
                    cardType: 'creature',
                    gameAction: ability.actions.cardLastingEffect((context) => ({
                        target: context.targets ? context.targets.Skirmish : [],
                        effect: ability.effects.addKeyword({ skirmish: 1 })
                    }))
                },
                Exalt: {
                    dependsOn: 'action',
                    controller: 'self',
                    mode: 'exactly',
                    numCards: 1,
                    cardType: 'creature',
                    gameAction: [
                        ability.actions.exalt((context) => ({
                            target: context.targets ? context.targets.Exalt : []
                        })),
                        ability.actions.cardLastingEffect((context) => ({
                            target: context.player.creaturesInPlay,
                            effect: ability.effects.addKeyword({
                                skirmish: 1
                            })
                        }))
                    ]
                }
            }
        });
    }
}

AnkyloFormation.id = 'ankylo-formation';

export default AnkyloFormation;
