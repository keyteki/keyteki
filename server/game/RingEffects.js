const AirRingEffect = require('./Rings/AirRingEffect');
const EarthRingEffect = require('./Rings/EarthRingEffect');
const FireRingEffect = require('./Rings/FireRingEffect');
const VoidRingEffect = require('./Rings/VoidRingEffect');
const WaterRingEffect = require('./Rings/WaterRingEffect');

const ElementToEffect = {
    air: optional => new AirRingEffect(optional),
    earth: optional => new EarthRingEffect(optional),
    fire: optional => new FireRingEffect(optional),
    void: optional => new VoidRingEffect(optional),
    water: optional => new WaterRingEffect(optional)
};

const RingNames = {
    air: 'Air Ring',
    earth: 'Earth Ring',
    fire: 'Fire Ring',
    void: 'Void Ring',
    water: 'Water Ring'
};

class RingEffects {
    static contextFor(player, element, optional = true) {
        let factory = ElementToEffect[element];

        if(!factory) {
            throw new Error(`Unknown ring effect of ${element}`);
        }

        let context = player.game.getFrameworkContext(player);
        context.source = player.game.rings[element];
        context.ability = factory(optional);
        return context;
    }

    static getRingName(element) {
        return RingNames[element];
    }
}

module.exports = RingEffects;
