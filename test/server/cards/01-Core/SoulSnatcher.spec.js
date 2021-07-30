describe('Soul Snatcher', function () {
    describe("Soul Snatcher's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    amber: 0,
                    hand: ['gateway-to-dis'],
                    inPlay: ['soul-snatcher', 'dust-imp', 'ember-imp']
                },
                player2: {
                    amber: 0,
                    inPlay: ['mighty-tiger', 'hunting-witch', 'bloodshard-imp']
                }
            });
        });

        it('should award 1 amber when own creature destroyed due to fighting', function () {
            this.player1.fightWith(this.emberImp, this.mightyTiger);
            expect(this.player1.player.amber).toBe(1);
            expect(this.player2.player.amber).toBe(0);
        });

        it("should award 3 amber when Dust Imp destroyed, due to Dust Imp's own amber bonus", function () {
            this.player1.fightWith(this.dustImp, this.mightyTiger);
            expect(this.player1.player.amber).toBe(3);
            expect(this.player2.player.amber).toBe(0);
        });

        it('should award 1 amber to both players when both have cards destroyed at same time', function () {
            this.player1.fightWith(this.emberImp, this.bloodshardImp);
            this.player1.clickCard(this.soulSnatcher);
            this.player1.clickCard(this.emberImp);
            expect(this.player1.player.amber).toBe(1);
            expect(this.player2.player.amber).toBe(1);
        });

        it('should award amber after a board wipe', function () {
            this.player1.play(this.gatewayToDis);
            this.player1.clickCard(this.soulSnatcher);
            this.player1.clickCard(this.soulSnatcher);
            this.player1.clickPrompt('Autoresolve');
            expect(this.player1.player.amber).toBe(4);
            expect(this.player2.player.amber).toBe(3);
        });
    });
});
