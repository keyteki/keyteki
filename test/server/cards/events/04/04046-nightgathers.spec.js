/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Night Gathers...', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('thenightswatch', [
                'A Noble Cause',
                'Night Gathers...', 'Steward at the Wall'
            ]);
            const deck2 = this.buildDeck('lannister', [
                'Sneak Attack',
                'Tyrion Lannister (Core)', 'Gold Cloaks'
            ]);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.skipSetupPhase();
            this.player1.selectPlot('A Noble Cause');
            this.player2.selectPlot('Sneak Attack');
            this.selectFirstPlayer(this.player1);

            this.skipActionWindow();

            this.steward = this.player1.findCardByName('Steward at the Wall');
            this.tyrion = this.player2.findCardByName('Tyrion Lannister (Core)');
            this.goldCloaks = this.player2.findCardByName('Gold Cloaks');
            this.player2Object.moveCard(this.tyrion, 'discard pile');
            this.player2Object.moveCard(this.goldCloaks, 'discard pile');

            this.player1.clickCard('Night Gathers...', 'hand');
        });

        it('should allow marshaling of your own cards from hand', function() {
            this.player1.clickCard(this.steward);
            expect(this.steward.location).toBe('play area');
            expect(this.player1Object.gold).toBe(3);
        });

        it('should allow marshaling of cards from opponents discard', function() {
            this.player1.clickCard(this.goldCloaks);
            expect(this.goldCloaks.location).toBe('play area');
            expect(this.goldCloaks.controller).toBe(this.player1Object);
            expect(this.player1Object.cardsInPlay.pluck('uuid')).toContain(this.goldCloaks.uuid);
            expect(this.player2Object.discardPile.pluck('uuid')).not.toContain(this.goldCloaks.uuid);
            expect(this.player1Object.gold).toBe(0);
        });

        it('should apply reducers to cards from opponents discard', function() {
            this.player1.clickCard(this.tyrion);
            expect(this.tyrion.location).toBe('play area');
            expect(this.tyrion.controller).toBe(this.player1Object);
            expect(this.player1Object.cardsInPlay.pluck('uuid')).toContain(this.tyrion.uuid);
            expect(this.player2Object.discardPile.pluck('uuid')).not.toContain(this.tyrion.uuid);
            expect(this.player1Object.gold).toBe(1);
        });
    });
});
