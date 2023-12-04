describe('Gongoozle', function () {
    describe("Gongoozle's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['dodger', 'silvertooth'],
                    hand: ['gongoozle', 'lamindra']
                },
                player2: {
                    inPlay: ['urchin', 'sneklifter', 'shadow-self'],
                    hand: ['shooler'],
                    amber: 3
                }
            });
        });

        it('if own creature is destroyed, should not discard own card', function () {
            this.player1.play(this.gongoozle);
            this.player1.clickCard(this.silvertooth);
            expect(this.silvertooth.location).toBe('discard');
            expect(this.shooler.location).toBe('hand');
        });

        it("if opponent's creature is destroyed, should not discard opponent's card", function () {
            this.player1.play(this.gongoozle);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.shooler.location).toBe('hand');
        });

        it('if own creature is not destroyed, should discard own card', function () {
            this.player1.play(this.gongoozle);
            this.player1.clickCard(this.dodger);
            expect(this.dodger.tokens.damage).toBe(3);
            expect(this.lamindra.location).toBe('discard');
        });

        it("if opponent's creature is not destroyed, should discard opponent's card", function () {
            this.player1.play(this.gongoozle);
            this.player1.clickCard(this.sneklifter);
            expect(this.sneklifter.location).toBe('play area');
            expect(this.sneklifter.tokens.damage).toBeUndefined();
            expect(this.shadowSelf.tokens.damage).toBe(3);
            expect(this.shooler.location).toBe('discard');
        });

        it('should discard if target is warded', function () {
            this.urchin.ward();
            this.player1.play(this.gongoozle);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('play area');
            expect(this.urchin.warded).toBe(false);
            expect(this.shooler.location).toBe('discard');
        });
    });
});
