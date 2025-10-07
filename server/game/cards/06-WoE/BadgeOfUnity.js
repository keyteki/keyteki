import Card from '../../Card.js';

class BadgeOfUnity extends Card {
    //This creature belongs to house Star Alliance in addition to its other houses.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addHouse('staralliance')
        });
    }
}

BadgeOfUnity.id = 'badge-of-unity';

export default BadgeOfUnity;
