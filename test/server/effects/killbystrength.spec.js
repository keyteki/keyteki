/* global describe, it, expect, beforeEach, integration, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const Effects = require('../../../server/game/effects.js');

describe('Effects.killByStrength', function() {
    describe('apply()', function() {
        beforeEach(function() {
            this.gameSpy = jasmine.createSpyObj('game', ['addMessage']);
            this.playerSpy = jasmine.createSpyObj('player', ['killCharacter']);
            this.cardSpy = jasmine.createSpyObj('card', ['getStrength']);
            this.cardSpy.controller = this.playerSpy;
            this.context = { game: this.gameSpy };
            this.effect = Effects.killByStrength;
        });

        describe('when the strength is above 0', function() {
            beforeEach(function() {
                this.cardSpy.getStrength.and.returnValue(1);
                this.effect.apply(this.cardSpy, this.context);
            });

            it('should not kill the card', function() {
                expect(this.playerSpy.killCharacter).not.toHaveBeenCalled();
            });
        });

        describe('when the strength is 0', function() {
            beforeEach(function() {
                this.cardSpy.getStrength.and.returnValue(0);
                this.effect.apply(this.cardSpy, this.context);
            });

            it('should kill the card', function() {
                expect(this.playerSpy.killCharacter).toHaveBeenCalledWith(this.cardSpy, false);
            });

            it('should not double kill when applied twice', function() {
                this.effect.apply(this.cardSpy, this.context);
                expect(this.playerSpy.killCharacter.calls.count()).toBe(1);
            });
        });
    });

    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('lannister', [
                'A Noble Cause',
                'Bastard Daughter', 'Bastard Daughter'
            ]);
            const deck2 = this.buildDeck('targaryen', [
                'Blood of the Dragon',
                'Hedge Knight', 'Hedge Knight', 'Hedge Knight', 'Hedge Knight', 'Hedge Knight', 'Hedge Knight', 'Hedge Knight'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();
            this.player1.clickCard('Bastard Daughter', 'hand');
            this.completeSetup();
            this.player1.selectPlot('A Noble Cause');
            this.player2.selectPlot('Blood of the Dragon');
        });

        describe('when a character is killed by a persistent burn effect', function() {
            beforeEach(function() {
                // Activate Bastard Daughter's ability
                this.player1.clickPrompt('Bastard Daughter');
            });

            it('should activate the ability', function() {
                expect(this.player2Object.hand.size()).toBe(6);
                expect(this.player2Object.discardPile.size()).toBe(1);
            });

            it('should not activate the ability twice', function() {
                expect(this.player1).not.toHavePromptButton('Bastard Daughter');
            });
        });
    });
});
