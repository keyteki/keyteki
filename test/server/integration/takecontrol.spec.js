/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('take control', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('stark', [
                'Sneak Attack', 'A Noble Cause', 'Valar Morghulis',
                'Ward'
            ]);
            const deck2 = this.buildDeck('tyrell', [
                'Sneak Attack', 'Confiscation',
                'Paxter Redwyne', 'Paxter Redwyne'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.ward = this.player1.findCardByName('Ward');
            [this.paxter, this.dupe] = this.player2.filterCardsByName('Paxter Redwyne');

            // Setup Paxter with a dupe.
            this.player2.clickCard(this.paxter);
            this.player2.clickCard(this.dupe);

            this.completeSetup();
            expect(this.paxter.dupes.size()).toBe(1);

            this.player1.selectPlot('Sneak Attack');
            this.player2.selectPlot('Sneak Attack');
            this.selectFirstPlayer(this.player1);
            this.player1.clickCard(this.ward);
            this.player1.clickCard(this.paxter);
        });

        it('should allow characters to be taken control', function() {
            expect(this.paxter.controller).toBe(this.player1Object);
        });

        describe('when the character would be killed', function() {
            beforeEach(function() {
                // Complete round 1
                this.completeMarshalPhase();
                this.completeChallengesPhase();
                this.completeDominancePhase();
                this.completeTaxationPhase();

                // Select plots for round 2
                this.player1.selectPlot('Valar Morghulis');
                this.player2.selectPlot('Confiscation');

                this.selectFirstPlayer(this.player1);
            });

            describe('and Valar goes before Confiscation', function() {
                beforeEach(function() {
                    this.player1.clickPrompt('player1');
                });

                it('should kill the character even with dupes', function() {
                    expect(this.paxter.location).toBe('dead pile');
                });
            });

            describe('and Confiscation goes before Valar', function() {
                beforeEach(function() {
                    this.player1.clickPrompt('player2');

                    // Remove the Ward via Confiscation
                    this.player2.clickCard(this.ward);

                    // Complete marshal phase to ensure both players have collected their gold
                    this.completeMarshalPhase();
                });

                it('should allow the character to be saved via the dupe', function() {
                    expect(this.paxter.location).toBe('play area');
                    expect(this.dupe.location).toBe('discard pile');
                });

                it('should return the character', function() {
                    expect(this.paxter.controller).toBe(this.player2Object);
                });

                it('should properly calculate any effects from the returned character', function() {
                    // 4 gold from plot, 1 gold from Paxter
                    expect(this.player2Object.gold).toBe(5);
                });

                it('should not give the opponent the effects of the returned character', function() {
                    // 2 gold from plot, 0 gold from Paxter
                    expect(this.player1Object.gold).toBe(2);
                });
            });
        });

        describe('when the effect is removed during plot phase', function() {
            beforeEach(function() {
                // Complete round 1
                this.completeMarshalPhase();
                this.completeChallengesPhase();
                this.completeDominancePhase();
                this.completeTaxationPhase();

                // Select plots for round 2
                this.player1.selectPlot('A Noble Cause');
                this.player2.selectPlot('Confiscation');
                this.selectFirstPlayer(this.player1);

                // Remove the Ward via Confiscation
                this.player2.clickCard(this.ward);

                // Complete marshal phase to ensure both players have collected their gold
                this.completeMarshalPhase();
            });

            it('should return the character', function() {
                expect(this.paxter.controller).toBe(this.player2Object);
            });

            it('should properly calculate any effects from the returned character', function() {
                // 4 gold from plot, 1 gold from Paxter
                expect(this.player2Object.gold).toBe(5);
            });

            it('should not give the opponent the effects of the returned character', function() {
                // 5 gold from plot, 0 gold from Paxter
                expect(this.player1Object.gold).toBe(5);
            });
        });
    });
});
