/*global describe, it, beforeEach, expect, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const DrawCard = require('../../../server/game/drawcard.js');

describe('the DrawCard', function() {
    describe('the hasKeyword() function', function() {
        beforeEach(function() {
            this.owner = {};
            this.card = new DrawCard(this.owner, {});
        });

        it('should return false if no keyword has been added', function() {
            expect(this.card.hasKeyword('stealth')).toBe(false);
        });

        it('should return true if a keyword has been added', function() {
            this.card.addKeyword('stealth');
            expect(this.card.hasKeyword('stealth')).toBe(true);
        });

        it('should not be case sensitive', function() {
            this.card.addKeyword('Intimidate');
            expect(this.card.hasKeyword('InTiMiDaTe')).toBe(true);
        });

        it('should return true if a keyword has been added more than it has been removed', function() {
            this.card.addKeyword('stealth');
            this.card.addKeyword('stealth');
            this.card.removeKeyword('stealth');
            expect(this.card.hasKeyword('stealth')).toBe(true);
        });

        it('should return false if a keyword has been removed more than it has been added', function() {
            this.card.removeKeyword('stealth');
            this.card.removeKeyword('stealth');
            this.card.addKeyword('stealth');
            expect(this.card.hasKeyword('stealth')).toBe(false);
        });
    });

    describe('integration', function() {
        const _ = require('underscore');

        const Game = require('../../../server/game/game.js');
        const Player = require('../../../server/game/player.js');

        beforeEach(function() {
            this.gameRepository = jasmine.createSpyObj('gameRepository', ['save']);
            this.game = new Game({}, { gameRepository: this.gameRepository });

            this.player = new Player(1, { username: 'foo' }, false, this.game);

            this.game.playersAndSpectators['foo'] = this.player;
            this.game.initialise();

            this.game.currentPhase = 'marshal';
            this.player.phase = 'marshal';
        });

        describe('parsing initial keywords', function() {
            describe('when the card mentions a keyword in its body', function() {
                beforeEach(function() {
                    this.card = new DrawCard(this.player, { text: 'Each <i>Ranger</i> character you control cannot be bypassed by stealth.\n<b>Interrupt:</b> When Benjen Stark is killed, gain 2 power for your faction. Then, shuffle him back into your deck instead of placing him in your dead pile."' });
                    this.card.location = 'hand';
                    this.player.hand = _([this.card]);
                    this.player.playCard(this.card, true);
                    // Resolve events in pipeline.
                    this.game.continue();
                });

                it('should return false.', function() {
                    expect(this.card.hasKeyword('Stealth')).toBe(false);
                });
            });

            describe('when the card has a keyword line', function() {
                beforeEach(function() {
                    this.card = new DrawCard(this.player, { type: 'attachment', cost: 0, text: 'Ancestral. Restricted. Notarealkeyword.\n Extra text because we need stuff here.' });
                    this.card.location = 'hand';
                    this.player.hand = _([this.card]);
                    this.player.playCard(this.card, true);
                    // Resolve events in pipeline.
                    this.game.continue();
                });

                it('should return true for each keyword', function() {
                    expect(this.card.hasKeyword('Ancestral')).toBe(true);
                    expect(this.card.hasKeyword('Restricted')).toBe(true);
                });

                it('should reject non-valid keywords', function() {
                    expect(this.card.hasKeyword('Notarealkeyword')).toBe(false);
                });

                it('should not blank externally given keywords', function() {
                    this.card.addKeyword('Sincerity');
                    this.card.setBlank();
                    // Resolve events in pipeline.
                    this.game.continue();
                    expect(this.card.hasKeyword('Ancestral')).toBe(false);
                    expect(this.card.hasKeyword('Restricted')).toBe(true);
                    expect(this.card.hasKeyword('Sincerity')).toBe(true);
                });
            });
        });
    });
});
