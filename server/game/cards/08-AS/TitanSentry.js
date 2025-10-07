import Card from '../../Card.js';

class TitanSentry extends Card {
    // Players cannot take their archives into their hands during
    // their "choose a house" step.
    // Play/After Reap: Choose a player. Put a random card from that player’s
    // hand into their archives.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.playerCannot('takeArchives')
        });

        this.play({
            reap: true,
            target: {
                mode: 'select',
                activePromptTitle: "Which player's hand",
                choices: {
                    Mine: () => true,
                    "Opponent's": (context) => !!context.player.opponent
                }
            },
            gameAction: ability.actions.archiveAtRandom((context) => ({
                target:
                    !context.select || context.select === 'Mine'
                        ? context.player
                        : context.player.opponent
            }))
        });
    }
}

TitanSentry.id = 'titan-sentry';

export default TitanSentry;
