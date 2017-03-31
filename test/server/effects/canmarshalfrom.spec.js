/*global describe, it, beforeEach, expect*/
/* eslint camelcase: 0, no-invalid-this: 0 */

const _ = require('underscore');

const Effects = require('../../../server/game/effects.js');

const MarshalLocation = require('../../../server/game/marshallocation.js');

describe('Effects.canMarshalFrom', function() {
    beforeEach(function() {
        this.context = {};

        this.player = { marshalLocations: [] };
        this.playerHand = new MarshalLocation(this.player, 'hand');
        this.player.marshalLocations.push(this.playerHand);

        this.opponent = { opponent: 1 };

        this.effect = Effects.canMarshalFrom(this.opponent, 'discard pile');
    });

    describe('apply()', function() {
        beforeEach(function() {
            this.effect.apply(this.player, this.context);
        });

        it('should add a marshal location', function() {
            let marshalLocation = _.last(this.player.marshalLocations);
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
            expect(this.player.marshalLocations).toEqual([this.playerHand]);
        });
    });
});
