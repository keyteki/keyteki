describe('Recruiting Station', function () {
    describe("Recruiting Station's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    token: 'grumpus',
                    inPlay: ['recruiting-station'],
                    hand: ['pelf']
                }
            });
        });

        it('should make a token creature if the house guess is correct', function () {
            this.player1.moveCard(this.pelf, 'deck');
            this.player1.useOmni(this.recruitingStation);
            this.player1.clickPrompt('brobnar');
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.pelf.location).toBe('discard');
            expect(this.player1.player.creaturesInPlay[0].name).toBe('Grumpus');
        });

        it('should not make a token creature if the house guess is wrong', function () {
            this.player1.moveCard(this.pelf, 'deck');
            this.player1.useOmni(this.recruitingStation);
            this.player1.clickPrompt('staralliance');
            expect(this.pelf.location).toBe('discard');
            expect(this.player1.player.creaturesInPlay.length).toBe(0);
        });
    });
});
