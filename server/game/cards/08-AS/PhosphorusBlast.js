import Card from '../../Card.js';

class PhosphorusBlast extends Card {
    // Play: Deal 2D to each non-Mars creature.
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 2 damage to all non-Mars creatures',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 2,
                target: context.game.creaturesInPlay.filter((card) => !card.hasHouse('mars'))
            }))
        });
    }
}

PhosphorusBlast.id = 'phosphorus-blast';

export default PhosphorusBlast;
