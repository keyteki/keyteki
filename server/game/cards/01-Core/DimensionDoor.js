const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class DimensionDoor extends Card {
    // Play: For the remainder of the turn, any <A> you would gain from reaping is stolen from your opponent instead.
    setupCardAbilities(ability) {
        this.enabledForPlayers = {};
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register([{ 'onReap:preResolution': 'onReap' }]);

        this.play({
            condition: (context) => !!context.player.opponent,
            effect: 'steal amber instead of gaining it while reaping for the remainder of the turn',
            gameAction: ability.actions.forRemainderOfTurn({
                effect: ability.effects.customDetachedPlayer({
                    apply: (player) => (this.enabledForPlayers[player.uuid] = true),
                    unapply: (player) => (this.enabledForPlayers[player.uuid] = false)
                })
            })
        });
    }

    onReap(event) {
        if (this.enabledForPlayers[event.card.controller.uuid]) {
            this.game.addMessage(
                "{0} steals 1 amber instead of gaining it due to {1}'s effect",
                event.card.controller,
                this
            );
            event.replaceHandler((event) =>
                this.game.actions.steal().resolve(event.context.player.opponent, event.context)
            );
        }
    }
}

DimensionDoor.id = 'dimension-door';

module.exports = DimensionDoor;
