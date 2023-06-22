const Card = require('../../Card.js');

class SpaceInvaders extends Card {
    // Play: Reveal any number of creatures from your hand. Make each
    // creature revealed this way a token creature as if the card was
    // on top of your deck.
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose which cards to reveal',
                mode: 'unlimited',
                controller: 'self',
                location: 'hand',
                cardType: 'creature',
                gameAction: ability.actions.makeTokenCreature((context) => ({
                    target: context.player,
                    amount: context.target.length,
                    cards: context.target,
                    cardLocation: 'hand',
                    alwaysSucceed: true
                }))
            },
            effect: 'reveal and tokenize {1}{2} {0}',
            effectArgs: (context) => [
                context.target.length > 0 ? context.target.length : 'nothing',
                context.target.length > 0
                    ? context.target.length > 1
                        ? ' creatures:'
                        : ' creature:'
                    : ''
            ]
        });
    }
}

SpaceInvaders.id = 'space-invaders';

module.exports = SpaceInvaders;
