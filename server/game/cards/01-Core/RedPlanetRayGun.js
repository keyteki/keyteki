const Card = require('../../Card.js');

class RedPlanetRayGun extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reap', {
                target: {
                    cardType: 'creature',
                    gameAction: ability.actions.dealDamage(context => ({
                        amount: context.game.creaturesInPlay.filter(card => card.hasHouse('mars')).length
                    }))
                }
            })
        });
    }
}

RedPlanetRayGun.id = 'red-planet-ray-gun'; // This is a guess at what the id might be - please check it!!!

module.exports = RedPlanetRayGun;
