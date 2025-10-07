import Card from '../../Card.js';

class Sinder extends Card {
    // Taunt. (This creatures neighbors cannot be attacked unless they have taunt.)
    // Reap: Destroy a friendly creature.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                location: 'play area',
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.destroy()
            }
        });
    }
}

Sinder.id = 'sinder';

export default Sinder;
