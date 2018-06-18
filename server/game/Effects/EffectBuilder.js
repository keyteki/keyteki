const _ = require('underscore');

const CardEffect = require('./CardEffect');
const PlayerEffect = require('./PlayerEffect');
const ConflictEffect = require('./ConflictEffect');
const RingEffect = require('./RingEffect');
const StaticEffect = require('./StaticEffect');
const DynamicEffect = require('./DynamicEffect');
const DetachedEffect = require('./DetachedEffect');

const EffectBuilder = {
    card: {
        static: (type, value) => ((game, source, props) => new CardEffect(game, source, props, new StaticEffect(type, value))),
        dynamic: (type, value) => ((game, source, props) => new CardEffect(game, source, props, new DynamicEffect(type, value))),
        detached: (type, value) => ((game, source, props) => new CardEffect(game, source, props, new DetachedEffect(type, value.apply, value.unapply))),
        flexible: (type, value) => _.isFunction(value) ? EffectBuilder.card.dynamic(type, value) : EffectBuilder.card.static(type, value)
    },
    player: {
        static: (type, value) => ((game, source, props) => new PlayerEffect(game, source, props, new StaticEffect(type, value))),
        dynamic: (type, value) => ((game, source, props) => new PlayerEffect(game, source, props, new DynamicEffect(type, value))),
        detached: (type, value) => ((game, source, props) => new PlayerEffect(game, source, props, new DetachedEffect(type, value.apply, value.unapply))),
        flexible: (type, value) => _.isFunction(value) ? EffectBuilder.player.dynamic(type, value) : EffectBuilder.player.static(type, value)
    },
    conflict: {
        static: (type, value) => ((game, source, props) => new ConflictEffect(game, source, props, new StaticEffect(type, value))),
        dynamic: (type, value) => ((game, source, props) => new ConflictEffect(game, source, props, new DynamicEffect(type, value))),
        detached: (type, value) => ((game, source, props) => new ConflictEffect(game, source, props, new DetachedEffect(type, value.apply, value.unapply))),
        flexible: (type, value) => _.isFunction(value) ? EffectBuilder.conflict.dynamic(type, value) : EffectBuilder.conflict.static(type, value)
    },
    ring: {
        static: (type, value) => ((game, source, props) => new RingEffect(game, source, props, new StaticEffect(type, value))),
        dynamic: (type, value) => ((game, source, props) => new RingEffect(game, source, props, new DynamicEffect(type, value))),
        detached: (type, value) => ((game, source, props) => new RingEffect(game, source, props, new DetachedEffect(type, value.apply, value.unapply))),
        flexible: (type, value) => _.isFunction(value) ? EffectBuilder.ring.dynamic(type, value) : EffectBuilder.ring.static(type, value)
    }
};

module.exports = EffectBuilder;
