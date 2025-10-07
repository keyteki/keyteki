import Card from '../../Card.js';

class TectonicShift extends Card {
    // Play: Divide each player's battleline in half as evenly as
    // possible without changing the order of creatures. For each
    // battleline, destroy each creature in one of the halves.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                enemyMiddle: {
                    activePromptTitle: 'Choose a half for the middle enemy creature',
                    mode: 'select',
                    choices: {
                        Left: (context) =>
                            !!context.player.opponent &&
                            context.player.opponent.creaturesInPlay.length % 2 !== 0,
                        Right: (context) =>
                            !!context.player.opponent &&
                            context.player.opponent.creaturesInPlay.length % 2 !== 0
                    }
                },
                friendlyMiddle: {
                    activePromptTitle: 'Choose a half for the middle friendly creature',
                    mode: 'select',
                    choices: {
                        Left: (context) => context.player.creaturesInPlay.length % 2 !== 0,
                        Right: (context) => context.player.creaturesInPlay.length % 2 !== 0
                    }
                },
                enemyHalf: {
                    activePromptTitle: 'Choose an enemy half to destroy',
                    mode: 'select',
                    choices: {
                        Left: (context) =>
                            !!context.player.opponent &&
                            context.player.opponent.creaturesInPlay.length > 0,
                        Right: (context) =>
                            !!context.player.opponent &&
                            context.player.opponent.creaturesInPlay.length > 0
                    }
                },
                friendlyHalf: {
                    activePromptTitle: 'Choose a friendly half to destroy',
                    mode: 'select',
                    choices: {
                        Left: (context) => context.player.creaturesInPlay.length > 0,
                        Right: (context) => context.player.creaturesInPlay.length > 0
                    }
                }
            },
            gameAction: ability.actions.destroy((context) => {
                let enemyPivot = context.player.opponent
                    ? context.player.opponent.creaturesInPlay.length / 2
                    : 0;
                if (
                    !!context.selects.enemyMiddle &&
                    context.selects.enemyMiddle.choice === 'Left'
                ) {
                    enemyPivot++;
                }
                let enemyTargets = [];
                if (context.player.opponent) {
                    enemyTargets =
                        !!context.selects.enemyHalf && context.selects.enemyHalf.choice === 'Left'
                            ? context.player.opponent.creaturesInPlay.slice(0, enemyPivot)
                            : context.player.opponent.creaturesInPlay.slice(enemyPivot);
                }

                let friendlyPivot = context.player.creaturesInPlay.length / 2;
                if (
                    !!context.selects.friendlyMiddle &&
                    context.selects.friendlyMiddle.choice === 'Left'
                ) {
                    friendlyPivot++;
                }
                let friendlyTargets =
                    !!context.selects.friendlyHalf && context.selects.friendlyHalf.choice === 'Left'
                        ? context.player.creaturesInPlay.slice(0, friendlyPivot)
                        : context.player.creaturesInPlay.slice(friendlyPivot);

                return {
                    target: enemyTargets.concat(friendlyTargets)
                };
            })
        });
    }
}

TectonicShift.id = 'tectonic-shift';

export default TectonicShift;
