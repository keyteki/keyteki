/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('nested ability sequences', function() {
    integration(function() {
        describe('abilities already in play', function() {
            beforeEach(function() {
                const deck = this.buildDeck('stark', [
                    'Trading with the Pentoshi',
                    'Robb Stark (Core)', 'Arya Stark (WotN)', 'Catelyn Stark (WotN)', 'Winterfell Steward', 'Winterfell Steward'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.robb = this.player1.findCardByName('Robb Stark (Core)', 'hand');
                this.arya = this.player1.findCardByName('Arya Stark (WotN)', 'hand');
                this.cat = this.player1.findCardByName('Catelyn Stark (WotN)', 'hand');
                [this.steward1, this.steward2] = this.player1.filterCardsByName('Winterfell Steward', 'hand');

                this.enemyRobb = this.player2.findCardByName('Robb Stark (Core)', 'hand');

                this.player1.clickCard(this.robb);
                this.player1.clickCard(this.steward1);
                this.player1.clickCard(this.steward2);
                this.player2.clickCard(this.enemyRobb);

                this.completeSetup();

                this.player1.selectPlot('Trading with the Pentoshi');
                this.player2.selectPlot('Trading with the Pentoshi');
                this.selectFirstPlayer(this.player1);

                // Resolve plot order
                this.selectPlotOrder(this.player1);

                this.player1.clickCard(this.steward1);
                this.player1.clickCard(this.steward2);
                this.player1.clickCard(this.arya);
                this.player1.clickCard(this.cat);
                this.completeMarshalPhase();

                this.player1.clickPrompt('Done');

                // Initiate a military challenge vs player 1
                this.player2.clickPrompt('Military');
                this.player2.clickCard(this.enemyRobb);
                this.player2.clickPrompt('Done');
                this.skipActionWindow();

                this.player1.clickCard(this.robb);
                this.player1.clickPrompt('Done');
                this.skipActionWindow();

                this.skipActionWindow();

                this.player2.clickPrompt('Apply Claim');

                // kill someone
                this.player1.clickCard(this.steward2);
            });

            it('should prompt with all available reactions', function() {
                expect(this.player1).toHavePromptButton('Robb Stark');
                expect(this.player1).toHavePromptButton('Arya Stark');
                expect(this.player1).toHavePromptButton('Catelyn Stark');
            });

            describe('when an ability triggers a new ability window', function() {
                beforeEach(function() {
                    // Arya Stark sacrifices herself, prompt to trigger
                    this.player1.clickPrompt('Arya Stark');
                });

                it('should prompt again with eligible cards', function() {
                    expect(this.player1).toHavePromptButton('Robb Stark');
                    expect(this.player1).toHavePromptButton('Catelyn Stark');
                    expect(this.player1).not.toHavePromptButton('Arya Stark');
                });

                it('should resolve the current trigger before continuing', function() {
                    this.player1.clickPrompt('Catelyn Stark');

                    expect(this.cat.power).toBe(1);
                    expect(this.player1).toHavePromptButton('Robb Stark');
                    expect(this.player1).not.toHavePromptButton('Catelyn Stark');
                    expect(this.player1).not.toHavePromptButton('Arya Stark');
                });

                it('should continue with the previous reaction window once the current trigger is resolved', function() {
                    this.player1.clickPrompt('Catelyn Stark');
                    this.player1.clickPrompt('Pass');

                    expect(this.player1).toHavePrompt('Select a character');
                    this.player1.clickPrompt('Done');

                    expect(this.player1).toHavePromptButton('Robb Stark');
                    expect(this.player1).toHavePromptButton('Catelyn Stark');
                    expect(this.player1).not.toHavePromptButton('Arya Stark');
                });

                it('should not allow abilities to trigger past their limit upon rewinding', function() {
                    // Gain power for Catelyn from Arya sacrifice (1)
                    this.player1.clickPrompt('Catelyn Stark');
                    this.player1.clickPrompt('Pass');

                    // Kill the other steward using Arya
                    expect(this.player1).toHavePrompt('Select a character');
                    this.player1.clickCard(this.steward1);

                    // Gain power for Catelyn from Steward #2 kill (2)
                    this.player1.clickPrompt('Catelyn Stark');
                    this.player1.clickPrompt('Pass');

                    // Even though Catelyn original was able to trigger from the
                    // killing of Steward #1, she has reached her ability limit and
                    // is no longer eligible.
                    expect(this.cat.power).toBe(2);
                    expect(this.player1).not.toHavePromptButton('Catelyn Stark');

                    // Robb Stark is still eligible though.
                    expect(this.player1).toHavePromptButton('Robb Stark');
                    expect(this.player1).not.toHavePromptButton('Arya Stark');
                });
            });
        });

        describe('when an eligible event is drawn mid-sequence', function() {
            beforeEach(function() {
                const deck = this.buildDeck('stark', [
                    'A Song of Summer',
                    'The Blackfish', 'Put to the Torch', 'Heart Tree Grove'
                ]);

                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.eventCard = this.player1.findCardByName('Put to the Torch', 'hand');
                this.player1.clickCard('The Blackfish', 'hand');
                this.player2.clickCard('Heart Tree Grove', 'hand');

                this.completeSetup();

                this.player1.selectPlot('A Song of Summer');
                this.player2.selectPlot('A Song of Summer');
                this.selectFirstPlayer(this.player1);

                // Move the event to draw so that it can be drawn via The Blackfish.
                this.player1Object.moveCard(this.eventCard, 'draw deck');

                this.completeMarshalPhase();

                this.player1.clickPrompt('Military');
                this.player1.clickCard('The Blackfish', 'play area');
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                // Activate Blackfish to draw a card.
                this.player1.clickPrompt('The Blackfish');
            });

            it('should prompt for the drawn card when eligible', function() {
                expect(this.eventCard.location).toBe('hand');
                expect(this.player1).toHavePromptButton('Put to the Torch');
            });
        });
    });
});
