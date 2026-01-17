const Card = require('../../Card.js');
const { DiscardCardAction } = require('../../GameActions/index.js');

class KaupeEvilTwin extends Card {
    // You cannot play more than 1 card of each type each turn.
    // Fight/Reap: Discard any number of cards from your hand. For each card discarded this way, deal 2D to an enemy creature.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                controller: 'self',
                location: 'hand',
                mode: 'unlimited',
                gameAction: ability.actions.discard()
            },
            then: {
                gameAction: ability.actions.allocateDamage((context) => ({
                    controller: 'opponent',
                    numSteps: DiscardCardAction.collectDiscardedCards(context.preThenEvents || [])
                        .length,
                    damageStep: 2
                }))
            }
        });

        this.persistentEffect({
            condition: () =>
                this.game.cardsPlayed.filter((card) => card.type === 'action').length > 0,
            targetController: 'current',
            effect: ability.effects.playerCannot(
                'play',
                (context) => context.ability && context.ability.title === 'Play this action'
            )
        });

        this.persistentEffect({
            condition: () =>
                this.game.cardsPlayed.filter((card) => card.type === 'artifact').length > 0,
            targetController: 'current',
            effect: ability.effects.playerCannot(
                'play',
                (context) => context.ability && context.ability.title === 'Play this artifact'
            )
        });

        this.persistentEffect({
            condition: () =>
                this.game.cardsPlayed.filter((card) => card.type === 'creature').length > 0,
            targetController: 'current',
            effect: ability.effects.playerCannot(
                'play',
                (context) => context.ability && context.ability.title === 'Play this creature'
            )
        });

        this.persistentEffect({
            condition: () =>
                this.game.cardsPlayed.filter((card) => card.type === 'upgrade').length > 0,
            targetController: 'current',
            effect: ability.effects.playerCannot(
                'play',
                (context) => context.ability && context.ability.title === 'Play this upgrade'
            )
        });
    }
}

KaupeEvilTwin.id = 'kaupe-evil-twin';

module.exports = KaupeEvilTwin;
