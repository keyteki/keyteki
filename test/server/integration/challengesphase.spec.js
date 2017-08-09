/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('challenges phase', function() {
    integration(function() {
        describe('when a character has stealth', function() {
            beforeEach(function() {
                const deck = this.buildDeck('lannister', [
                    'Sneak Attack',
                    'Tyrion Lannister (Core)', 'Joffrey Baratheon (Core)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();
                this.player1.clickCard('Tyrion Lannister', 'hand');
                this.player2.clickCard('Joffrey Baratheon', 'hand');
                this.completeSetup();

                this.player1.selectPlot('Sneak Attack');
                this.player2.selectPlot('Sneak Attack');
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.player1.clickPrompt('Intrigue');
                this.player1.clickCard('Tyrion Lannister', 'play area');
                this.player1.clickPrompt('Done');
            });

            it('should prompt for stealth targets before reactions', function() {
                let stealthTarget = this.player2.findCardByName('Joffrey Baratheon', 'play area');

                expect(this.player1).toHavePrompt('Select stealth target for Tyrion Lannister');

                this.player1.clickCard(stealthTarget);

                expect(this.player1).toHavePromptButton('Tyrion Lannister');
                expect(stealthTarget.stealth).toBe(true);
            });
        });

        describe('when a side has higher strength but no participating characters', function() {
            beforeEach(function() {
                const deck = this.buildDeck('thenightswatch', [
                    'Sneak Attack',
                    'Steward at the Wall', 'The Haunted Forest', 'The Haunted Forest', 'The Shadow Tower'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();
                this.player1.clickCard('Steward at the Wall', 'hand');
                this.player2.clickCard('The Haunted Forest', 'hand');
                this.player2.clickCard('The Haunted Forest', 'hand');
                this.player2.clickCard('The Shadow Tower', 'hand');
                this.completeSetup();

                this.player1.selectPlot('Sneak Attack');
                this.player2.selectPlot('Sneak Attack');
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();
                
                this.player1.clickPrompt('Intrigue');
                this.player1.clickCard('Steward at the Wall', 'play area');
                this.player1.clickPrompt('Done');

                // Skip attackers declared window
                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                // Skip defenders declared window
                this.skipActionWindow();
            });

            it('should not trigger any win reactions for the defender', function() {
                expect(this.player2).not.toHavePromptButton('The Shadow Tower');
            });

            it('should complete the challenge', function() {
                expect(this.player1).toHavePromptButton('Military');
                expect(this.player1).toHavePromptButton('Intrigue');
                expect(this.player1).toHavePromptButton('Power');
            });
        });

        describe('when initiating a challenge', function() {
            beforeEach(function() {
                const deck = this.buildDeck('lannister', [
                    'Trading with the Pentoshi',
                    'Tyrion Lannister (Core)', 'Dornish Paramour', 'Marya Seaworth', 'Jojen Reed', 'Hedge Knight', 'Lannisport Merchant'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.knight = this.player2.findCardByName('Hedge Knight', 'hand');
                this.merchant = this.player2.findCardByName('Lannisport Merchant', 'hand');

                this.player1.clickCard('Tyrion Lannister', 'hand');
                this.player1.clickCard('Dornish Paramour', 'hand');
                this.player2.clickCard(this.knight);
                this.player2.clickCard(this.merchant);
                this.completeSetup();

                this.player1.selectPlot('Trading with the Pentoshi');
                this.player2.selectPlot('Trading with the Pentoshi');
                this.selectFirstPlayer(this.player1);
                this.selectPlotOrder(this.player1);

                this.player1.clickCard('Marya Seaworth', 'hand');
                this.player1.clickCard('Jojen Reed', 'hand');
                this.completeMarshalPhase();

                this.initiateChallenge = () => {
                    this.player1.clickPrompt('Intrigue');
                    this.player1.clickCard('Tyrion Lannister', 'play area');
                    this.player1.clickCard('Jojen Reed', 'play area');
                    this.player1.clickCard('Dornish Paramour', 'play area');
                    this.player1.clickPrompt('Done');

                    // Select 2 stealth targets
                    this.player1.clickCard(this.knight);
                    this.player1.clickCard(this.merchant);
                };
            });

            it('should prompt for challenge initiated, attackers declared, and stealth simultaneously', function() {
                this.initiateChallenge();

                expect(this.player1).toHavePromptButton('Tyrion Lannister');
                expect(this.player1).toHavePromptButton('Dornish Paramour');
                expect(this.player1).toHavePromptButton('Marya Seaworth - Kneel Hedge Knight');
                expect(this.player1).toHavePromptButton('Marya Seaworth - Kneel Lannisport Merchant');
                expect(this.player1.currentPrompt().buttons.length).toBe(5);
            });

            it('should reactions in the same window to generate gold needed to pay costs', function() {
                this.player1Object.gold = 0;
                this.initiateChallenge();
                expect(this.player1).not.toHavePromptButton('Marya Seaworth - Kneel Hedge Knight');
                expect(this.player1).not.toHavePromptButton('Marya Seaworth - Kneel Lannisport Merchant');

                this.player1.clickPrompt('Tyrion Lannister');

                expect(this.player1).toHavePromptButton('Marya Seaworth - Kneel Hedge Knight');
                expect(this.player1).toHavePromptButton('Marya Seaworth - Kneel Lannisport Merchant');
            });
        });
    });
});
