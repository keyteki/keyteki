import Card from '../../Card.js';

class CaptainNoBeardEvilTwin extends Card {
    // Taunt. (This creature’s neighbors cannot be attacked unless they have taunt.)
    // Destroyed: Each of Captain No-Beard's neighbors captures 1A.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.capture((context) => ({
                target: context.source.neighbors
            }))
        });
    }
}

CaptainNoBeardEvilTwin.id = 'captain-no-beard-evil-twin';

export default CaptainNoBeardEvilTwin;
