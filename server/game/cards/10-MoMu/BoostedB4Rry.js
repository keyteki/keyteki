import GiganticCard from '../../GiganticCard.js';

class BoostedB4Rry extends GiganticCard {
    // (Play only with the other half of Boosted B4-RRY.)
    // Play/After Fight/After Reap: Choose one:
    //    Take control of an enemy artifact. While under your control, it
    //      belongs to house Shadows (instead of its original house).
    //    Play a random card from your opponent’s archives as if it were yours.
    constructor(owner, cardData) {
        super(owner, cardData);
    }

    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.play({
            fight: true,
            reap: true,
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        'Take artifact': () => true,
                        'Play archived card': () => true
                    }
                },
                'Take artifact.choice': {
                    dependsOn: 'action',
                    cardType: 'artifact',
                    controller: 'opponent',
                    gameAction: [
                        ability.actions.cardLastingEffect((context) => ({
                            duration: 'lastingEffect',
                            effect: ability.effects.takeControl(context.player)
                        })),
                        ability.actions.cardLastingEffect((context) => ({
                            duration: 'lastingEffect',
                            until: {
                                onTakeControl: (event) =>
                                    event.card === context.targets['Take artifact.choice'] &&
                                    event.player === context.player.opponent
                            },
                            effect: ability.effects.changeHouse('shadows')
                        }))
                    ]
                }
            },
            then: (preThenContext) => ({
                alwaysTriggers: true,
                condition: () => preThenContext.selects.action.choice === 'Play archived card',
                gameAction: ability.actions.playAtRandom((context) => ({
                    location: 'archives',
                    revealOnIllegalTarget: true,
                    target: context.player.opponent
                }))
            })
        });
    }
}

BoostedB4Rry.id = 'boosted-b4-rry';

export default BoostedB4Rry;
