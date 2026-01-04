describe('Outlook Not So Good', function () {
    describe("Outlook Not So Good's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    prophecies: [
                        'outlook-not-so-good',
                        'expect-the-unexpected',
                        'forge-ahead-with-confidence',
                        'fate-laughs-at-your-plans'
                    ],
                    hand: ['parasitic-arachnoid', 'soulkeeper']
                },
                player2: {
                    amber: 4,
                    hand: ['troll', 'ember-imp'],
                    inPlay: ['hard-simpson']
                }
            });
        });

        it('should fulfill when opponent chooses a house with no cards in play', function () {
            this.player1.activateProphecy(this.outlookNotSoGood, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.hardSimpson);
            expect(this.player2.amber).toBe(2);
            expect(this.hardSimpson.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not fulfill when opponent chooses a house with cards in play', function () {
            this.player1.activateProphecy(this.outlookNotSoGood, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not fulfill when opponent chooses a house with upgrades in play', function () {
            this.player1.activateProphecy(this.outlookNotSoGood, this.parasiticArachnoid);
            this.player1.playUpgrade(this.soulkeeper, this.hardSimpson);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not fulfill when you choose a house with no cards in play', function () {
            this.player1.activateProphecy(this.outlookNotSoGood, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
