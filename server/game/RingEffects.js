const AirRingEffect = require('./Rings/AirRingEffect');
const EarthRingEffect = require('./Rings/EarthRingEffect');
const FireRingEffect = require('./Rings/FireRingEffect');
const VoidRingEffect = require('./Rings/VoidRingEffect');
const WaterRingEffect = require('./Rings/WaterRingEffect');
const RingSource = require('./Rings/RingSource');
const AbilityContext = require('./AbilityContext');

const ElementToEffect = {
    air: optional => new AirRingEffect(optional),
    earth: optional => new EarthRingEffect(optional),
    fire: optional => new FireRingEffect(optional),
    void: optional => new VoidRingEffect(optional),
    water: optional => new WaterRingEffect(optional)
};

class RingEffects {
    static ContextFor(player, element, optional = true) {
        let factory = ElementToEffect[element];

        if(!factory) {
            throw new Error(`Unknown ring effect of ${element}`);
        }
        
        return (new AbilityContext({
            game: player.game,
            player: player,
            source: new RingSource(player, player.game.rings[element]),
            ability: factory(optional)
        }));
    }
}

module.exports = RingEffects;
