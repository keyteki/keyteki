/* global describe, it, expect, beforeEach, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const _ = require('underscore');

const cards = require('../../../server/game/cards');

describe('All Cards', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['on', 'removeListener', 'addPower', 'addMessage']);
        this.playerSpy = jasmine.createSpyObj('player', ['']);
        this.playerSpy.game = this.gameSpy;
    });

    _.each(cards, cardClass => {
        it('should be able to create \'' + cardClass.name + '\' and set it up', function() {
            // No explicit assertion - if this throws an exception it will fail
            // and give us a better stacktrace than the expect().not.toThrow()
            // assertion.
            new cardClass(this.playerSpy, {});
        });
    });
});
