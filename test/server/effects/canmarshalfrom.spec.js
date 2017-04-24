/*global describe, it, beforeEach, expect*/
/* eslint camelcase: 0, no-invalid-this: 0 */

const _ = require('underscore');

const Effects = require('../../../server/game/effects.js');

const PlayableLocation = require('../../../server/game/playablelocation.js');

describe('Effects.canMarshalFrom', function() {
    beforeEach(function() {
        this.context = {};

        this.player = { playableLocations: [] };
        this.playerHand = new PlayableLocation('marshal', this.player, 'hand');
        this.player.playableLocations.push(this.playerHand);

        this.opponent = { opponent: 1 };

        this.effect = Effects.canMarshalFrom(this.opponent, 'discard pile');
    });

    describe('apply()', function() {
        beforeEach(function() {
            this.effect.apply(this.player, this.context);
        });

        it('should add a marshal location', function() {
            let marshalLocation = _.last(this.player.playableLocations);
            expect(marshalLocation.location).toBe('discard pile');
            expect(marshalLocation.player).toBe(this.opponent);
        });
    });

    describe('unapply()', function() {
        beforeEach(function() {
            this.effect.apply(this.player, this.context);
            this.effect.unapply(this.player, this.context);
        });

        it('should remove the added marshal location', function() {
            expect(this.player.playableLocations).toEqual([this.playerHand]);
        });
    });
});
