describe('Song Of The Wild', function () {
    describe("Song Of The Wild's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['dust-pixie', 'rustgnawer', 'snufflegator', 'duskwitch'],
                    hand: ['song-of-the-wild', 'dew-faerie']
                },
                player2: {
                    inPlay: ['mighty-tiger', 'grabber-jammer']
                }
            });
        });
        it("should give all friendly creatures 'Reap: Gain 1A' until the end of the turn", function () {
            this.player1.play(this.songOfTheWild);
            this.player1.reap(this.dustPixie);
            this.player1.reap(this.rustgnawer);
            this.player1.reap(this.snufflegator);
            expect(this.player1.amber).toBe(6);
        });
        it("should not give newly played friendly creatures 'Reap: Gain 1A' until the end of the turn", function () {
            this.player1.play(this.songOfTheWild);
            this.player1.reap(this.dustPixie);
            this.player1.reap(this.rustgnawer);
            this.player1.reap(this.snufflegator);
            expect(this.player1.amber).toBe(6);
            this.player1.play(this.dewFaerie);
            this.player1.reap(this.dewFaerie);
            expect(this.player1.amber).toBe(8);
        });
        it("should not carry over to the opponent's turn", function () {
            this.player1.play(this.songOfTheWild);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.mightyTiger);
            expect(this.player2.amber).toBe(1);
        });
    });
});
