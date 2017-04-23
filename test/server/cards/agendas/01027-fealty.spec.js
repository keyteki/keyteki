/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Fealty', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('greyjoy', [
                'Fealty',
                'Sneak Attack',
                'Balon Greyjoy (Core)', 'Theon Greyjoy'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.skipSetupPhase();

            this.player1.selectPlot('Sneak Attack');
            this.player2.selectPlot('Sneak Attack');
            this.selectFirstPlayer(this.player1);

            this.skipActionWindow();

            this.balon = this.player1.findCardByName('Balon Greyjoy (Core)', 'hand');
            this.theon = this.player1.findCardByName('Theon Greyjoy', 'hand');

            this.player1.clickMenu('Fealty', 'Kneel your faction card');
        });

        it('should kneel the faction card', function() {
            expect(this.player1Object.faction.kneeled).toBe(true);
        });

        it('should reduce the cost of loyal cards by 1', function() {
            this.player1.clickCard(this.balon);
            expect(this.balon.location).toBe('play area');
            expect(this.player1Object.gold).toBe(0);
        });

        it('should not reduce the cost of non-loyal cards', function() {
            this.player1.clickCard(this.theon);
            expect(this.theon.location).toBe('play area');
            expect(this.player1Object.gold).toBe(1);
        });
    });
});
