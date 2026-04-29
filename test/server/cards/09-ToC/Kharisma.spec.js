describe('Kharisma', function () {
    describe("Kharisma's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    token: 'niffle-brute',
                    inPlay: ['kharisma', 'dust-pixie']
                },
                player2: {
                    amber: 2,
                    inPlay: ['umbra']
                }
            });

            this.niffleBrute1 = this.player1.player.deck[0];
        });

        it('should return a friendly creature and make a token creature', function () {
            this.player1.reap(this.kharisma);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.kharisma);
            expect(this.player1).not.toBeAbleToSelect(this.umbra);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickPrompt('Right');
            expect(this.dustPixie.location).toBe('hand');
            expect(this.niffleBrute1.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not make a token if no creature was returned', function () {
            this.dustPixie.ward();
            this.player1.reap(this.kharisma);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('play area');
            expect(this.niffleBrute1.location).toBe('deck');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
