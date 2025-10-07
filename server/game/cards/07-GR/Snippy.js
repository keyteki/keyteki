import Card from '../../Card.js';

class Snippy extends Card {
    // Play: Deal 2 to a creature.
    //
    // Scrap: Destroy an enemy flank creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'any',
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({
                    amount: 2
                })
            }
        });

        this.scrap({
            target: {
                controller: 'opponent',
                cardType: 'creature',
                cardCondition: (card) => card.isOnFlank(),
                gameAction: ability.actions.destroy()
            }
        });
    }
}

Snippy.id = 'snippy';

export default Snippy;
