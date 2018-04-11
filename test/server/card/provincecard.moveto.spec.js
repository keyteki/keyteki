const ProvinceCard = require('../../../server/game/provincecard.js');

describe('ProvinceCard', function () {
    beforeEach(function () {
        this.testCard = { code: '111', label: 'test 1(some pack)', name: 'test 1' };
        this.gameSpy = jasmine.createSpyObj('game', ['emitEvent']);
        this.card = new ProvinceCard({ game: this.gameSpy }, this.testCard);
    });

    describe('moveTo()', function() {
        it('should set the location', function() {
            this.card.moveTo('stronghold province');
            expect(this.card.location).toBe('stronghold province');
        });

        describe('when the card is facedown', function() {
            beforeEach(function() {
                this.card.facedown = true;
            });

            describe('when moved to a province', function() {
                beforeEach(function() {
                    this.card.moveTo('province 1');
                });

                it('should not flip the card', function() {
                    expect(this.card.facedown).toBe(true);
                });
            });
        });

        describe('when the card has a reaction', function() {
            beforeEach(function() {
                this.card.reaction({
                    title: 'Force opponent to discard cards equal to the number of attackers',
                    when: {
                        onProvinceRevealed: event => event.province === this && this.controller.opponent.hand.size() > 0
                    },
                    handler: () => {
                        this.game.doSomething();
                    }
                });
                spyOn(this.card.abilities.reactions[0], 'registerEvents');
                spyOn(this.card.abilities.reactions[0], 'unregisterEvents');
            });

            describe('when in a non-event handling area', function() {
                beforeEach(function() {
                    this.card.location = 'province deck';
                });

                describe('and moving to an event handling area', function() {
                    beforeEach(function() {
                        this.card.moveTo('stronghold province');
                    });

                    it('should register events', function() {
                        expect(this.card.abilities.reactions[0].registerEvents).toHaveBeenCalled();
                    });

                    it('should not unregister events', function() {
                        expect(this.card.abilities.reactions[0].unregisterEvents).not.toHaveBeenCalled();
                    });
                });
            });

            describe('when in an event handling area', function() {
                beforeEach(function() {
                    this.card.location = 'province 1';
                });

                describe('and moving to another event handling area', function() {
                    beforeEach(function() {
                        this.card.moveTo('province 2');
                    });

                    it('should not register events', function() {
                        expect(this.card.abilities.reactions[0].registerEvents).not.toHaveBeenCalled();
                    });

                    it('should not unregister events', function() {
                        expect(this.card.abilities.reactions[0].unregisterEvents).not.toHaveBeenCalled();
                    });
                });

                describe('and moving to a non-event handling area', function() {
                    beforeEach(function() {
                        this.card.moveTo('province deck');
                    });

                    it('should not register events', function() {
                        expect(this.card.abilities.reactions[0].registerEvents).not.toHaveBeenCalled();
                    });

                    it('should unregister events', function() {
                        expect(this.card.abilities.reactions[0].unregisterEvents).toHaveBeenCalled();
                    });
                });
            });
        });
    });
});
