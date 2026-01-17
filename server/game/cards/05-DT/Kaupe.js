const Card = require('../../Card.js');

class Kaupe extends Card {
    // Your opponent cannot play more than 1 card of each card type (action, artifact, creature, upgrade) each turn.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game.cardsPlayed.filter((card) => card.type === 'action').length > 0,
            targetController: 'opponent',
            effect: ability.effects.playerCannot(
                'play',
                (context) => context.ability && context.ability.title === 'Play this action'
            )
        });

        this.persistentEffect({
            condition: () =>
                this.game.cardsPlayed.filter((card) => card.type === 'artifact').length > 0,
            targetController: 'opponent',
            effect: ability.effects.playerCannot(
                'play',
                (context) => context.ability && context.ability.title === 'Play this artifact'
            )
        });

        this.persistentEffect({
            condition: () =>
                this.game.cardsPlayed.filter((card) => card.type === 'creature').length > 0,
            targetController: 'opponent',
            effect: ability.effects.playerCannot(
                'play',
                (context) => context.ability && context.ability.title === 'Play this creature'
            )
        });

        this.persistentEffect({
            condition: () =>
                this.game.cardsPlayed.filter((card) => card.type === 'upgrade').length > 0,
            targetController: 'opponent',
            effect: ability.effects.playerCannot(
                'play',
                (context) => context.ability && context.ability.title === 'Play this upgrade'
            )
        });
    }
}

Kaupe.id = 'kaupe';

module.exports = Kaupe;
