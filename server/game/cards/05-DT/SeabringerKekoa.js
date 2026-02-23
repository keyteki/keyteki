import Card from '../../Card.js';
class SeabringerKekoa extends Card {
    // Taunt. (This creature’s neighbors cannot be attacked unless they have taunt.)
    // (T) Destroyed: Raise the tide.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.raiseTide()
        });
    }
}

SeabringerKekoa.id = 'seabringer-kekoa';

export default SeabringerKekoa;
