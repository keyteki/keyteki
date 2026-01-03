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

    describe("Recruit's ability outside of the main phase", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: [
                        'jargogle',
                        'orator-hissaro',
                        'daughter',
                        'brillix-ponder',
                        'strange-gizmo',
                        'recruit'
                    ],
                    amber: 6
                },
                player2: {
                    inPlay: ['ragwarg'],
                    amber: 0
                }
            });
        });

        it('should count creatures exalted during start of turn', function () {
            this.player1.play(this.jargogle);
            this.player1.clickCard(this.oratorHissaro);
            this.player1.play(this.brillixPonder);
            this.player1.play(this.daughter);
            this.player1.play(this.strangeGizmo);
            this.brillixPonder.tokens.ward = 1;
            this.daughter.tokens.ward = 1;
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();

            // Strange Gizmo causes Jargogle to play orator hissaro after forging a key
            this.player1.clickPrompt('red');
            this.player1.clickPrompt('deploy right');
            this.player1.clickCard(this.brillixPonder);
            this.player1.clickCard(this.brillixPonder);
            this.player1.clickCard(this.daughter);
            this.player1.clickPrompt('saurian');
            this.player1.play(this.recruit);
            expect(this.recruit.location).toBe('archives');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
