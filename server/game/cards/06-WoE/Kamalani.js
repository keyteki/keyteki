import Card from '../../Card.js';

class Kamalani extends Card {
    //Destroyed: Make 2 token creatures.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.makeTokenCreature({ amount: 2 })
        });
    }
}

Kamalani.id = 'kamalani';

export default Kamalani;
