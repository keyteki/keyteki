describe('Kangaphant', function () {
    describe("Kangaphant's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['dust-pixie', 'kangaphant', 'snufflegator', 'duskwitch'],
                    hand: ['song-of-the-wild', 'dew-faerie']
                },
                player2: {
                    inPlay: ['mighty-tiger', 'grabber-jammer']
                }
            });
        });
        it("should give all creatures 'Reap: Destroy this Creature'", function () {
            this.player1.reap(this.dustPixie);
            this.player1.reap(this.duskwitch);
            this.player1.reap(this.snufflegator);
            expect(this.player1.amber).toBe(3);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.snufflegator.location).toBe('discard');
            expect(this.duskwitch.location).toBe('discard');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.mightyTiger);
            expect(this.player2.amber).toBe(1);
            expect(this.mightyTiger.location).toBe('discard');
        });

        it('should end if Kangaphant is destroyed', function () {
            this.player1.reap(this.kangaphant);
            this.player1.reap(this.snufflegator);
            expect(this.kangaphant.location).toBe('discard');
            expect(this.snufflegator.location).toBe('play area');
            expect(this.player1.amber).toBe(2);
        });
    });
});
