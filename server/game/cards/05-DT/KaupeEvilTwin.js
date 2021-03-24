const Card = require('../../Card.js');

class KaupeEvilTwin extends Card {
    //You cannot play more than 1 card of each card type each turn.
    //Fight/Reap:You may discard any number of cards from your hand. Deal 2D to an enemy creature for each card discarded this way.
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
                target: {
                    controller: 'opponent',
                    cardType: 'creature',
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount: 2 * context.preThenEvents.length
                    }))
                }
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

module.exports = KaupeEvilTwin;
