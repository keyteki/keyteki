import Card from '../../Card.js';

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
                    numSteps: context.preThenEvents.length || 0,
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
                (context) => context.source.type === 'action'
            )
        });

        this.persistentEffect({
            condition: () =>
                this.game.cardsPlayed.filter((card) => card.type === 'artifact').length > 0,
            targetController: 'current',
            effect: ability.effects.playerCannot(
                'play',
                (context) => context.source.type === 'artifact'
            )
        });

        this.persistentEffect({
            condition: () =>
                this.game.cardsPlayed.filter((card) => card.type === 'creature').length > 0,
            targetController: 'current',
            effect: ability.effects.playerCannot(
                'play',
                (context) => context.source.type === 'creature'
            )
        });

        this.persistentEffect({
            condition: () =>
                this.game.cardsPlayed.filter((card) => card.type === 'upgrade').length > 0,
            targetController: 'current',
            effect: ability.effects.playerCannot(
                'play',
                (context) => context.source.type === 'upgrade'
            )
        });
    }
}

KaupeEvilTwin.id = 'kaupe-evil-twin';

export default KaupeEvilTwin;
