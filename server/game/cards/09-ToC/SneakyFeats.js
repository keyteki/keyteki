const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class SneakyFeats extends Card {
    // Play: Make a token creature. If you have stolen at least 1A this turn,
    // archive Sneaky Feats.
    setupCardAbilities(ability) {
        this.activePlayerStoleAmber = false;
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onStealAmber', { 'onTurnEnd:preResolution': 'onTurnEnd' }]);

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

    onTurnEnd() {
        this.activePlayerStoleAmber = false;
    }
}

SneakyFeats.id = 'sneaky-feats';

module.exports = SneakyFeats;
