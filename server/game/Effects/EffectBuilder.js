import _ from 'underscore';

import CardEffect from './CardEffect.js';
import PlayerEffect from './PlayerEffect.js';
import StaticEffect from './StaticEffect.js';
import DynamicEffect from './DynamicEffect.js';
import DetachedEffect from './DetachedEffect.js';

const EffectBuilder = {
    card: {
        static: (type, value) => (game, source, props) =>
            new CardEffect(game, source, props, new StaticEffect(type, value)),
        dynamic: (type, value) => (game, source, props) =>
            new CardEffect(game, source, props, new DynamicEffect(type, value)),
        detached: (type, value) => (game, source, props) =>
            new CardEffect(
                game,
                source,
                props,
                new DetachedEffect(type, value.apply, value.unapply)
            ),
        flexible: (type, value) =>
            _.isFunction(value)
                ? EffectBuilder.card.dynamic(type, value)
                : EffectBuilder.card.static(type, value)
    },
    player: {
        static: (type, value) => (game, source, props) =>
            new PlayerEffect(game, source, props, new StaticEffect(type, value)),
        dynamic: (type, value) => (game, source, props) =>
            new PlayerEffect(game, source, props, new DynamicEffect(type, value)),
        detached: (type, value) => (game, source, props) =>
            new PlayerEffect(
                game,
                source,
                props,
                new DetachedEffect(type, value.apply, value.unapply)
            ),
        flexible: (type, value) =>
            _.isFunction(value)
                ? EffectBuilder.player.dynamic(type, value)
                : EffectBuilder.player.static(type, value)
    }
};

export default EffectBuilder;
