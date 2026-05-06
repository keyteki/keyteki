const EffectSource = require('./EffectSource.js');

/**
 * Source object used as `context.source` when a bonus icon is being resolved.
 *
 * Bonus icons are resolved by the game framework, not the card on which they
 * appear.  Using a plain `EffectSource` for these contexts works for rules purposes but produces an
 * unhelpful chat label ("Framework effect") and was previously embedded raw
 * in chat messages, creating circular references in the game state.
 *
 * `BonusIconSource` keeps the rules-correct behaviour (it is not a `Card`, so
 * source-trait checks treat it as an unknown source) while exposing a useful
 * `name` for chat ("Stalwart's capture bonus icon") and a `controller`
 * delegated to the underlying card.
 */
class BonusIconSource extends EffectSource {
    /**
     * @param {import('./game')} game
     * @param {import('./Card')} card  The card whose bonus icon is being resolved.
     * @param {string} icon            The icon being resolved (e.g. 'capture').
     */
    constructor(game, card, icon) {
        super(game);
        this.card = card;
        this.icon = icon;
    }

    get name() {
        return `${this.card.name}'s ${this.icon} bonus icon`;
    }

    get controller() {
        return this.card.controller;
    }
}

module.exports = BonusIconSource;
