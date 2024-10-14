describe('Harlock', function () {
    describe("Harlock's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    token: 'niffle-brute',
                    inPlay: ['harlock']
                },
                player2: {
                    amber: 2,
                    inPlay: ['umbra', 'old-bruno']
                }
            });

            this.niffleBrute1 = this.player1.player.deck[0];
        });

        it('should make a token creature if fought creature was destroyed', function () {
            this.player1.fightWith(this.harlock, this.umbra);
            this.player1.clickPrompt('Right');
            expect(this.niffleBrute1.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not make a token creature if fought creature was not destroyed', function () {
            this.player1.fightWith(this.harlock, this.oldBruno);
            expect(this.niffleBrute1.location).toBe('deck');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not make a token creature if fought creature was warded', function () {
            this.umbra.ward();
            this.player1.fightWith(this.harlock, this.umbra);
            expect(this.niffleBrute1.location).toBe('deck');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should be playable without breaking everything', function () {
            this.player1.moveCard(this.harlock, 'hand');
            this.player1.playCreature(this.harlock);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
