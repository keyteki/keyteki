const Card = require('../../Card.js');

class RedPlanetRayGun extends Card {
    // This creature gains, Reap: Choose a creature. Deal 1D to that creature for each Mars creature in play.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reap', {
                target: {
                    cardType: 'creature',
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount: context.game.creaturesInPlay.filter((card) => card.hasHouse('mars'))
                            .length
                    }))
                }
            })
        });
    }
}

RedPlanetRayGun.id = 'red-planet-ray-gun';

module.exports = RedPlanetRayGun;
