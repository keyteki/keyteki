describe('Dthoshră, Recruiter', function () {
    describe("Dthoshră, Recruiter's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    token: 'grunt',
                    inPlay: ['antiquities-dealer', 'dthoshră-recruiter']
                }
            });
        });

        it('makes a token creature after reaping', function () {
            this.player1.reap(this.antiquitiesDealer);
            expect(this.player1.amber).toBe(2);
            this.player1.reap(this.dthoshrăRecruiter);
            expect(this.player1.amber).toBe(3);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
