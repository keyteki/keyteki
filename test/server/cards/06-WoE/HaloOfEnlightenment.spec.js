describe('Halo of Enlightenment', function () {
    describe("Halo of Enlightenment's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 3,
                    token: 'disciple',
                    inPlay: ['troll', 'holdfast'],
                    hand: ['halo-of-enlightenment', 'sir-bevor']
                },
                player2: {
                    amber: 4,
                    inPlay: ['batdrone', 'mother']
                }
            });

            this.player1.moveCard(this.sirBevor, 'deck');
        });

        it('should create a token when played', function () {
            this.player1.playUpgrade(this.haloOfEnlightenment, this.troll);
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            this.player1.endTurn();
        });

        it('should prevent attacking the attached creature while controller has a token', function () {
            this.player1.playUpgrade(this.haloOfEnlightenment, this.troll);
            this.player1.clickPrompt('Left');
            this.player1.endTurn();

            this.player2.clickPrompt('logos');
            this.player2.clickCard(this.mother);
            this.player2.clickPrompt('Fight with this creature');
            expect(this.player2).toBeAbleToSelect(this.sirBevor);
            expect(this.player2).toBeAbleToSelect(this.holdfast);
            expect(this.player2).not.toBeAbleToSelect(this.troll);

            this.player2.clickCard(this.sirBevor);
            expect(this.sirBevor.location).toBe('discard');

            this.player2.clickCard(this.batdrone);
            this.player2.clickPrompt('Fight with this creature');
            expect(this.player2).toBeAbleToSelect(this.holdfast);
            expect(this.player2).toBeAbleToSelect(this.troll);
        });
    });
});
