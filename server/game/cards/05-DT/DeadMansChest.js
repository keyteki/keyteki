const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class DeadMansChest extends Card {
    // Play: Put 4A on Dead Man’s Chest from the supply. Deal 2 to a creature.
    // If 6 or more creatures are destroyed during a turn and Dead Man’s Chest is ready, move all A from Dead Man’s Chest to the active player’s pool.
    setupCardAbilities(ability) {
        this.creatureDestroyedControllerUuid = {};
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onRoundEnded', 'onCardDestroyed']);

        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            },
            gameAction: ability.actions.placeAmber({
                amount: 4,
                target: this
            })
        });

        this.reaction({
            when: {
                onCardDestroyed: (event) =>
                    this.creatureDestroyedControllerUuid[event.player.uuid] &&
                    this.creatureDestroyedControllerUuid[event.player.uuid].length > 6
            },
            gameAction: ability.actions.removeAmber({ all: true }),
            then: {
                gameAction: ability.actions.gainAmber((context) => ({
                    amount: context.preThenEvent.amount,
                    target: context.game.activePlayer
                }))
            }
        });
    }

    onRoundEnded() {
        this.creatureDestroyedControllerUuid = {};
    }

    onCardDestroyed(event) {
        if (event.clone.type === 'creature') {
            this.creatureDestroyedControllerUuid[event.clone.controller.uuid] = true;
        }
    }
}

DeadMansChest.id = 'dead-man-s-chest';

module.exports = DeadMansChest;
