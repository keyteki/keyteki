describe('Catena Fiend', function () {
    describe("Catena Fiend's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    token: 'catena-fiend',
                    inPlay: ['shooler', 'catena-fiend:toad']
                },
                player2: {
                    amber: 6,
                    inPlay: ['pelf', 'troll']
                }
            });

            this.catenaFiend = this.player1.player.creaturesInPlay[1];
        });

        it('should steal one on fight', function () {
            this.player1.fightWith(this.catenaFiend, this.pelf);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(5);
        });

        it('should deal 3 damage to a friendly creature on fight', function () {
            this.player1.fightWith(this.catenaFiend, this.pelf);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.catenaFiend);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.shooler);
            expect(this.shooler.damage).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should steal even when killing self', function () {
            this.player1.fightWith(this.catenaFiend, this.pelf);
            this.player1.clickCard(this.catenaFiend);
            expect(this.catenaFiend.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
