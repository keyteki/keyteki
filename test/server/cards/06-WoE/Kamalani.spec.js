describe('Kamalani', function () {
    describe("Kamalani's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    token: 'b0-t',
                    amber: 1,
                    inPlay: ['kamalani'],
                    hand: ['sensor-chief-garcia']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should make 2 token creature when destroyed', function () {
            this.player1.fightWith(this.kamalani, this.krump);
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Left');
            expect(this.kamalani.location).toBe('discard');
            expect(this.player1.inPlay.length).toBe(2);
            expect(this.player1.inPlay[0].name).toBe('B0-T');
            expect(this.player1.inPlay[1].name).toBe('B0-T');
        });
    });
});
