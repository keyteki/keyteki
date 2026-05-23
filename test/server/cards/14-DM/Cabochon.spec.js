describe('Cabochon', function () {
    describe("Cabochon's ability when exhausted at start of turn", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['cabochon', 'bosun-creen', 'flip-stallard']
                },
                player2: {
                    house: 'shadows'
                }
            });
        });

        it('gains amber for each friendly Skyborn flank creature', function () {
            this.cabochon.exhaust();
            this.player1.endTurn();
            // entrench prompt - select Cabochon to keep exhausted
            this.player1.clickCard(this.cabochon);
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('skyborn');
            // Battleline: cabochon (left flank, skyborn), bosun-creen (center), flip-stallard (right flank, skyborn)
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Cabochon's ability when ready at start of turn", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['cabochon', 'bosun-creen', 'flip-stallard']
                },
                player2: {
                    house: 'shadows'
                }
            });
        });

        it('does not gain amber', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('skyborn');
            expect(this.player1.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Cabochon with non-Skyborn flank creature', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['cabochon', 'flip-stallard', 'troll']
                },
                player2: {
                    house: 'shadows'
                }
            });
        });

        it('does not count non-Skyborn flank creatures', function () {
            this.cabochon.exhaust();
            this.player1.endTurn();
            this.player1.clickCard(this.cabochon);
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('skyborn');
            // Cabochon (left, skyborn) + flip-stallard (center) + troll (right, brobnar)
            // Only Cabochon is a Skyborn flank.
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
