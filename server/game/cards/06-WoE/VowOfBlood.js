import Card from '../../Card.js';

class VowOfBlood extends Card {
    // Enhance . (These icons have already been added to cards in your deck.)
    // Play: Deal 2 to each damaged enemy creature.
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 2 damage to each damaged enemy creature',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 2,
                target: context.game.creaturesInPlay.filter(
                    (card) => card.controller !== context.player && card.hasToken('damage')
                )
            }))
        });
    }
}

VowOfBlood.id = 'vow-of-blood';

export default VowOfBlood;
