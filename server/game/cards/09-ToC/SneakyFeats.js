import Card from '../../Card.js';
import EventRegistrar from '../../eventregistrar.js';

class SneakyFeats extends Card {
    // Play: Make a token creature. If you have stolen at least 1A this turn,
    // archive Sneaky Feats.
    setupCardAbilities(ability) {
        this.activePlayerStoleAmber = false;
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onStealAmber', { 'onRoundEnded:preResolution': 'onRoundEnded' }]);

        this.play({
            gameAction: ability.actions.makeTokenCreature(),
            then: {
                alwaysTriggers: true,
                condition: () => this.activePlayerStoleAmber,
                gameAction: ability.actions.archive((context) => ({
                    effect: 'archive {1}',
                    target: context.source
                })),
                message: '{0} uses {1} to archive {3}',
                messageArgs: (context) => [context.source]
            }
        });
    }

    onStealAmber(event) {
        if (event.player.opponent === this.game.activePlayer) {
            this.activePlayerStoleAmber = true;
        }
    }

    onRoundEnded() {
        this.activePlayerStoleAmber = false;
    }
}

SneakyFeats.id = 'sneaky-feats';

export default SneakyFeats;
