import Card from '../../Card.js';

class Fish extends Card {
    //Destroyed: Deal 2D to the most powerful enemy creature.
    setupCardAbilities(ability) {
        this.destroyed({
            target: {
                mode: 'mostStat',
                cardType: 'creature',
                controller: 'opponent',
                cardStat: (card) => card.power,
                gameAction: ability.actions.dealDamage({ amount: 2 })
            }
        });
    }
}

Fish.id = 'fish';

export default Fish;
