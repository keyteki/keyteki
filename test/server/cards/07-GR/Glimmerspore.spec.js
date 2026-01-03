describe('Glimmerspore', function () {
    describe("Glimmerspore's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'mars',
                    hand: ['glimmerspore'],
                    inPlay: ['flaxia', 'quixxle-stone']
                },
                player2: {
                    hand: ['curse-of-fertility'],
                    inPlay: ['dust-pixie', 'ritual-of-balance']
                }
            });
        });

        it('can put an enemy artifact into archives', function () {
            this.player1.play(this.glimmerspore);
            expect(this.player1).toBeAbleToSelect(this.quixxleStone);
            expect(this.player1).toBeAbleToSelect(this.ritualOfBalance);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.ritualOfBalance);
            expect(this.ritualOfBalance.location).toBe('archives');
            expect(this.player1.player.archives).toContain(this.ritualOfBalance);
            this.expectReadyToTakeAction(this.player1);
        });

        it('can put a friendly artifact into archives', function () {
            this.player1.play(this.glimmerspore);
            this.player1.clickCard(this.quixxleStone);
            expect(this.quixxleStone.location).toBe('archives');
            expect(this.player1.player.archives).toContain(this.quixxleStone);
            this.expectReadyToTakeAction(this.player1);
        });

        it('returns enemy artifact to the owner when taking archives', function () {
            this.player1.play(this.glimmerspore);
            this.player1.clickCard(this.ritualOfBalance);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('mars');
            expect(this.player1).toHavePrompt('Access Archives');
            this.player1.clickPrompt('Yes');
            expect(this.ritualOfBalance.location).toBe('hand');
            expect(this.player2.player.hand).toContain(this.ritualOfBalance);
            this.expectReadyToTakeAction(this.player1);
        });

        it('can put a self-controlled, opponent-owned artifact into archives', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.curseOfFertility);
            this.player2.endTurn();
            this.player1.clickPrompt('mars');
            this.player1.play(this.glimmerspore);
            this.player1.clickCard(this.curseOfFertility);
            expect(this.curseOfFertility.location).toBe('archives');
            expect(this.player1.player.archives).toContain(this.curseOfFertility);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
