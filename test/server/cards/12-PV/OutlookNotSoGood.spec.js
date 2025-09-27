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
                    hand: ['parasitic-arachnoid']
                },
                player2: {
                    amber: 4,
                    hand: ['troll', 'flame-wreathed'],
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
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not fulfill when opponent chooses a house with cards in play', function () {
            this.player1.activateProphecy(this.outlookNotSoGood, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not fulfill when opponent chooses a house with just upgrades in play', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.playUpgrade(this.flameWreathed, this.hardSimpson);
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.activateProphecy(this.outlookNotSoGood, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not fulfill when you choose a house with no cards in play', function () {
            this.player1.activateProphecy(this.outlookNotSoGood, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
