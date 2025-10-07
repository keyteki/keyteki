import Card from '../../Card.js';

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
                gameAction: ability.actions.makeTokenCreature()
            },
            effect: 'reveal and tokenize {0}'
        });
    }
}

SpaceInvaders.id = 'space-invaders';

export default SpaceInvaders;
