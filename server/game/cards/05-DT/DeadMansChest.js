const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class DeadMansChest extends Card {
    // Play: Put 4A on Dead Man’s Chest from the common supply. Deal 2D to a creature.
    // After 6 or more creatures are destroyed in a turn, if Dead Man’s Chest is ready, move each A from Dead Man’s Chest to the active player's pool.
    setupCardAbilities(ability) {
        this.creatureDestroyed = [];
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onTurnEnd', 'onCardDestroyed']);

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
                onCardDestroyed: (event, context) =>
                    !context.source.exhausted &&
                    this.creatureDestroyed.length >= 6 &&
                    this.creatureDestroyed[5] === event.card.uuid
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

    onTurnEnd() {
        this.creatureDestroyed = [];
    }

    onCardDestroyed(event) {
        if (event.clone.type === 'creature') {
            this.creatureDestroyed.push(event.card.uuid);
        }
    }
}

DeadMansChest.id = 'dead-man-s-chest';

module.exports = DeadMansChest;
