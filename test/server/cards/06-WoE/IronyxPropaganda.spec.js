describe('Ironyx Propaganda', function () {
    describe("Ironyx Propaganda's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'mars',
                    token: 'grunt',
                    inPlay: ['tunk'],
                    hand: ['ironyx-propaganda']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra']
                }
            });

            this.versusCard = this.player1.deck[0];
            this.player1.playUpgrade(this.ironyxPropaganda, this.tunk);
        });

        it('should make a token creature after reap', function () {
            this.player1.reap(this.tunk);
            this.player1.clickPrompt('Left');
            let grunt = this.player1.inPlay[0];
            expect(grunt.id).toBe('grunt');
            expect(grunt.versusCard).toBe(this.versusCard);
            this.player1.endTurn();
        });

        it('should make a token creature after fight', function () {
            this.player1.fightWith(this.tunk, this.lamindra);
            this.player1.clickPrompt('Left');
            let grunt = this.player1.inPlay[0];
            expect(grunt.id).toBe('grunt');
            expect(grunt.versusCard).toBe(this.versusCard);
            this.player1.endTurn();
        });
    });
});
