const DrawCard = require('../../../server/game/drawcard.js');

describe('the DrawCard', function() {
    describe('the hasKeyword() function', function() {
        beforeEach(function() {
            this.addCovert = jasmine.createSpyObj('addCovert', ['getValue']);
            this.addCovert.getValue.and.returnValue('covert');
            this.addCovert.type = 'addKeyword';
            this.owner = { noTimer: true };
            this.card = new DrawCard(this.owner, {});
        });

        it('should return false if no keyword has been added', function() {
            expect(this.card.hasKeyword('covert')).toBe(false);
        });

        it('should return true if a keyword has been added', function() {
            this.card.addEffect(this.addCovert);
            expect(this.card.hasKeyword('covert')).toBe(true);
        });

        it('should not be case sensitive', function() {
            this.card.addEffect(this.addCovert);
            expect(this.card.hasKeyword('COveRT')).toBe(true);
        });
        /*
        it('should return true if a keyword has been added more than it has been removed', function() {
            this.card.addKeyword('covert');
            this.card.addKeyword('covert');
            this.card.removeKeyword('covert');
            expect(this.card.hasKeyword('covert')).toBe(true);
        });

        it('should return false if a keyword has been removed more than it has been added', function() {
            this.card.removeKeyword('covert');
            this.card.removeKeyword('covert');
            this.card.addKeyword('covert');
            expect(this.card.hasKeyword('covert')).toBe(false);
        });
        */
    });

    describe('integration', function() {
        const _ = require('underscore');

        const Game = require('../../../server/game/game.js');
        const Player = require('../../../server/game/player.js');

        beforeEach(function() {
            this.gameService = jasmine.createSpyObj('gameService', ['save']);
            this.game = new Game({}, { gameService: this.gameService });
            this.spy = spyOn(this.game, 'checkWinCondition');

            this.player = new Player(1, { username: 'foo', settings: { optionSettings: {} } }, false, this.game);
            this.player.noTimer = true;
            this.player2 = new Player(2, { username: 'bar', settings: { optionSettings: {} } }, false, this.game);

            this.game.playersAndSpectators['foo'] = this.player;
            this.game.playersAndSpectators['bar'] = this.player2;
            this.game.initialise();
            this.game.setFirstPlayer(this.player);

            this.game.currentPhase = 'dynasty';
            this.player.phase = 'dynasty';
            this.addSincerity = jasmine.createSpyObj('addCovert', ['getValue']);
            this.addSincerity.getValue.and.returnValue('sincerity');
            this.addSincerity.type = 'addKeyword';
            this.blankEffect = jasmine.createSpyObj('addCovert', ['getValue']);
            this.blankEffect.getValue.and.returnValue(true);
            this.blankEffect.type = 'blank';
        });

        describe('parsing initial keywords', function() {
            describe('when the card mentions a keyword in its body', function() {
                beforeEach(function() {
                    this.card = new DrawCard(this.player, { text: 'Each <i>Covert</i> character you control cannot be bypassed by covert.' });
                    this.card.location = 'hand';
                    this.player.hand = _([this.card]);
                    //this.player.initiateCardAction(this.card);
                    // Resolve events in pipeline.
                    this.game.continue();
                });

                it('should return false.', function() {
                    expect(this.card.hasKeyword('covert')).toBe(false);
                });
            });

            describe('when the card has a keyword line', function() {
                beforeEach(function() {
                    this.card = new DrawCard(this.player, { type: 'character', cost: 0, side: 'dynasty', text: 'Covert.\nSomestuff. Restricted.\nNotarealkeyword.\nExtra text because we need stuff here.' });
                    this.card.location = 'province 1';
                    this.player.provinceOne = _([this.card]);
                    this.player.dynastyDeck = _([new DrawCard(this.player, {})]);
                    this.player.moveCard(this.card, 'play area');
                    // Resolve events in pipeline.
                    this.game.continue();
                    this.game.checkGameState(true);
                });

                it('should return true for each keyword', function() {
                    expect(this.card.hasKeyword('covert')).toBe(true);
                    expect(this.card.hasKeyword('Restricted')).toBe(true);
                });

                it('should reject non-valid keywords', function() {
                    expect(this.card.hasKeyword('Notarealkeyword')).toBe(false);
                });

                it('should not blank externally given keywords', function() {
                    this.card.addEffect(this.addSincerity);
                    this.card.addEffect(this.blankEffect);
                    this.game.checkGameState(true);
                    expect(this.card.hasKeyword('covert')).toBe(false);
                    expect(this.card.hasKeyword('Restricted')).toBe(false);
                    expect(this.card.hasKeyword('Sincerity')).toBe(true);
                });
            });
        });
    });
});
