import Card from '../../Card.js';

class GruntWork extends Card {
    // Play: Look at the top 3 cards of your deck and put them back in
    // any order. Make a token creature.
    setupCardAbilities(ability) {
        this.play({
            effect:
                'look at the top 3 cards of their deck, rearrange them in any order, and make a token creature',
            gameAction: ability.actions.sequential([
                ability.actions.rearrangeCards({ amount: 3 }),
                ability.actions.makeTokenCreature()
            ])
        });
    }
}

GruntWork.id = 'grunt-work';

export default GruntWork;
