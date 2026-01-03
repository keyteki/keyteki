describe('Trust Your Feelings', function () {
    describe("Trust Your Feelings's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    prophecies: [
                        'trust-your-feelings',
                        'heads-i-win',
                        'forge-ahead-with-confidence',
                        'fate-laughs-at-your-plans'
                    ],
                    hand: ['ember-imp', 'parasitic-arachnoid'],
                    inPlay: ['charette']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll', 'urchin']
                }
            });
        });

        it('should fulfill when opponent chooses the named house', function () {
            this.player1.activateProphecy(this.trustYourFeelings, this.parasiticArachnoid);
            this.player1.clickPrompt('brobnar');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.troll);
            expect(this.player2.amber).toBe(2);
            expect(this.troll.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
            this.expectReadyToTakeAction(this.player2);

            // Doesn't trigger again next turn.
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.expectReadyToTakeAction(this.player2);
        });

        it('should not fulfill when opponent chooses a different house', function () {
            this.player1.activateProphecy(this.trustYourFeelings, this.parasiticArachnoid);
            this.player1.clickPrompt('ekwidon');
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            expect(this.parasiticArachnoid.location).toBe('under');
            this.expectReadyToTakeAction(this.player2);
        });

        it('should not fulfill when player chooses the house', function () {
            this.player1.activateProphecy(this.trustYourFeelings, this.parasiticArachnoid);
            this.player1.clickPrompt('dis');
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            expect(this.parasiticArachnoid.location).toBe('under');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not trigger if the prophecy flips with a card already under it', function () {
            this.player1.activateProphecy(this.headsIWin, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player1.clickCard(this.headsIWin);
            this.player2.clickPrompt('brobnar');
            expect(this.parasiticArachnoid.location).toBe('under');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
