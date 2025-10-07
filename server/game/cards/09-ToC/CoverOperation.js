import Card from '../../Card.js';

class CoverOperation extends Card {
    // Play: Make a token creature, then ready it.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature(),
            effect: 'make a token creature and ready it',
            then: {
                gameAction: ability.actions.ready((context) => ({
                    target: context.preThenEvent.card
                }))
            }
        });
    }
}

CoverOperation.id = 'cover-operation';

export default CoverOperation;
