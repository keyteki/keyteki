/* global describe, it, beforeEach, expect, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const MarshalCardAction = require('../../server/game/marshalcardaction.js');

describe('MarshalCardAction', function () {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'on', 'removeListener']);
        this.playerSpy = jasmine.createSpyObj('player', ['getDuplicateInPlay', 'isCardInMarshalLocation', 'isCharacterDead', 'putIntoPlay']);
        this.opponentSpy = jasmine.createSpyObj('opponentPlayer', ['getDuplicateInPlay', 'isCharacterDead']);
        this.cardSpy = jasmine.createSpyObj('card', ['getType']);
        this.cardSpy.controller = this.playerSpy;
        this.cardSpy.owner = this.playerSpy;
        this.context = {
            costs: {},
            game: this.gameSpy,
            player: this.playerSpy,
            source: this.cardSpy
        };
        this.action = new MarshalCardAction();
    });

    describe('meetsRequirements()', function() {
        beforeEach(function() {
            this.gameSpy.currentPhase = 'marshal';
            this.playerSpy.isCardInMarshalLocation.and.returnValue(true);
            this.cardSpy.getType.and.returnValue('character');
        });

        describe('when all conditions are met', function() {
            it('should return true', function() {
                expect(this.action.meetsRequirements(this.context)).toBe(true);
            });
        });

        describe('when the phase not marshal', function() {
            beforeEach(function() {
                this.gameSpy.currentPhase = 'dominance';
            });

            it('should return false', function() {
                expect(this.action.meetsRequirements(this.context)).toBe(false);
            });
        });

        describe('when the card is not in a valid marshal location', function() {
            beforeEach(function() {
                this.playerSpy.isCardInMarshalLocation.and.returnValue(false);
            });

            it('should return false', function() {
                expect(this.action.meetsRequirements(this.context)).toBe(false);
            });
        });

        describe('when the card is an event', function() {
            beforeEach(function() {
                this.cardSpy.getType.and.returnValue('event');
            });

            it('should return false', function() {
                expect(this.action.meetsRequirements(this.context)).toBe(false);
            });
        });

        describe('when the card is forbidden from being marshalled', function() {
            beforeEach(function() {
                this.cardSpy.cannotMarshal = true;
            });

            it('should return false', function() {
                expect(this.action.meetsRequirements(this.context)).toBe(false);
            });
        });

        describe('when the player is the owner of the card', function() {
            beforeEach(function() {
                this.cardSpy.owner = this.playerSpy;
            });

            describe('and the character is already in play', function() {
                beforeEach(function() {
                    this.playerSpy.getDuplicateInPlay.and.returnValue({ foo: 'bar' });
                });

                it('should return true', function() {
                    expect(this.action.meetsRequirements(this.context)).toBe(true);
                });
            });

            describe('and the character is dead', function() {
                beforeEach(function() {
                    this.playerSpy.isCharacterDead.and.returnValue(true);
                });

                it('should return false', function() {
                    expect(this.action.meetsRequirements(this.context)).toBe(false);
                });
            });
        });

        describe('when the player is not the owner of the card', function() {
            beforeEach(function() {
                this.cardSpy.owner = this.opponentSpy;
            });

            describe('and the character is already in play', function() {
                beforeEach(function() {
                    this.playerSpy.getDuplicateInPlay.and.returnValue({ foo: 'bar' });
                });

                it('should return false', function() {
                    expect(this.action.meetsRequirements(this.context)).toBe(false);
                });
            });

            describe('and the character is in play for the owner', function() {
                beforeEach(function() {
                    this.opponentSpy.getDuplicateInPlay.and.returnValue({ foo: 'bar' });
                });

                it('should return false', function() {
                    expect(this.action.meetsRequirements(this.context)).toBe(false);
                });
            });

            describe('and the character is dead for the owner', function() {
                beforeEach(function() {
                    this.opponentSpy.isCharacterDead.and.returnValue(true);
                });

                it('should return false', function() {
                    expect(this.action.meetsRequirements(this.context)).toBe(false);
                });
            });
        });
    });

    describe('executeHandler()', function() {
        beforeEach(function() {
            this.action.executeHandler(this.context);
        });

        it('should put the card into play', function() {
            expect(this.playerSpy.putIntoPlay).toHaveBeenCalledWith(this.cardSpy, 'marshal');
        });
    });
});
