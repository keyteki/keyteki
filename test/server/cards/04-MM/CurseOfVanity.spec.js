describe('Curse of Vanity', function () {
    describe("Curse of Vanity's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['senator-shrix', 'gub'],
                    hand: ['curse-of-vanity']
                },
                player2: {
                    inPlay: ['desire', 'troll']
                }
            });
        });

        it('should exalt one friendly and one enemy creature', function () {
            this.player1.play(this.curseOfVanity);
            expect(this.player1).toBeAbleToSelect(this.senatorShrix);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.desire);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.senatorShrix);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.desire);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.gub.amber).toBe(1);
            expect(this.troll.amber).toBe(1);
        });
    });
});
