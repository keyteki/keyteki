describe('R-Evolution', function () {
    describe("R-Evolution's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['tunk', 'tunk', 'pelf'],
                    hand: ['r-evolution']
                },
                player2: {
                    inPlay: ['tunk', 'umbra', 'troll']
                }
            });
        });

        it('gives each creature with the same name a reap ability', function () {
            this.tunk2 = this.player1.player.creaturesInPlay[1];
            this.tunk3 = this.player2.player.creaturesInPlay[0];
            this.player1.playUpgrade(this.rEvolution, this.tunk);
            this.player1.reap(this.tunk);
            expect(this.player1).toBeAbleToSelect(this.tunk3);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.tunk);
            expect(this.player1).not.toBeAbleToSelect(this.tunk2);
            expect(this.player1).not.toBeAbleToSelect(this.pelf);
            this.player1.clickCard(this.umbra);
            expect(this.umbra.location).toBe('discard');
            this.player1.reap(this.tunk2);
            expect(this.player1).toBeAbleToSelect(this.tunk3);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.tunk);
            expect(this.player1).not.toBeAbleToSelect(this.tunk2);
            expect(this.player1).not.toBeAbleToSelect(this.pelf);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(2);
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.reap(this.tunk3);
            expect(this.player2).not.toBeAbleToSelect(this.tunk3);
            expect(this.player2).not.toBeAbleToSelect(this.troll);
            expect(this.player2).toBeAbleToSelect(this.tunk);
            expect(this.player2).toBeAbleToSelect(this.tunk2);
            expect(this.player2).toBeAbleToSelect(this.pelf);
            this.player2.clickCard(this.pelf);
            expect(this.pelf.tokens.damage).toBe(2);
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.reap(this.pelf);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
