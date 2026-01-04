describe('Taniwha', function () {
    describe("Taniwha's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'unfathomable',
                    inPlay: ['taniwha', 'shooler', 'hookmaster']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra', 'gamgee']
                }
            });
        });

        it('should destroy a friendly creature and gain 1A after fight', function () {
            this.player1.fightWith(this.taniwha, this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.taniwha);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.hookmaster);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.gamgee);
            this.player1.clickCard(this.shooler);
            expect(this.shooler.location).toBe('discard');
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should destroy a friendly creature and gain 1A after reap', function () {
            this.player1.reap(this.taniwha, this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.taniwha);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.hookmaster);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.gamgee);
            this.player1.clickCard(this.shooler);
            expect(this.shooler.location).toBe('discard');
            expect(this.player1.amber).toBe(6);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
