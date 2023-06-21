describe('Recruit', function () {
    describe("Recruit's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    token: 'grumpus',
                    inPlay: ['questor-jarta'],
                    hand: ['recruit', 'curse-of-vanity']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should not archive if no friendly creatures have been exalted', function () {
            this.player1.play(this.recruit);
            this.player1.clickPrompt('Right');
            expect(this.recruit.location).toBe('discard');
        });

        it('should archive if there was a friendly creature exalted', function () {
            this.player1.reap(this.questorJarta);
            this.player1.clickCard(this.questorJarta);
            this.player1.play(this.recruit);
            this.player1.clickPrompt('Right');
            expect(this.recruit.location).toBe('archives');
        });

        it('should not archive if there was only an enemy creature exalted', function () {
            this.player1.fightWith(this.questorJarta, this.troll);
            this.player1.play(this.curseOfVanity);
            this.player1.clickCard(this.troll);
            this.player1.play(this.recruit);
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.recruit.location).toBe('discard');
        });
    });
});
