describe('Commandeer', function () {
    describe("Commandeer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['dust-pixie'],
                    hand: ['commandeer', 'sequis', 'francus']
                },
                player2: {
                    amber: 3,
                    inPlay: ['bad-penny']
                }
            });
        });
        it('should capture when you play a card', function () {
            this.player1.play(this.commandeer);
            expect(this.commandeer.location).toBe('discard');
            this.player1.play(this.sequis);
            expect(this.sequis.location).toBe('play area');
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).not.toBeAbleToSelect(this.badPenny);
            this.player1.clickCard(this.sequis);
            expect(this.sequis.tokens.amber).toBe(1);
            expect(this.dustPixie.tokens.amber).toBe(undefined);
            expect(this.player2.amber).toBe(2);
        });
    });
});
