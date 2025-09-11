describe('Missile Officer Myers', function () {
    describe("Missile Officer Myer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    hand: ['missile-officer-myers', 'exhume', 'legerdemain'],
                    inPlay: ['charette', 'medic-ingram'],
                    discard: ['gub']
                },
                player2: {
                    amber: 6
                }
            });
        });

        it('can resolve play ability of left neighbor on play', function () {
            this.player1.clickCard(this.missileOfficerMyers);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickPrompt('Deploy Left');
            this.player1.clickCard(this.medicIngram);

            this.player1.clickCard(this.charette);
            expect(this.charette.amber).toBe(3);
            expect(this.player2.amber).toBe(3);
        });

        it('can resolve play ability of right neighbor on play', function () {
            this.player1.clickCard(this.missileOfficerMyers);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickPrompt('Deploy Left');
            this.player1.clickCard(this.medicIngram);

            this.player1.clickCard(this.medicIngram);
            this.player1.clickCard(this.missileOfficerMyers);
            expect(this.missileOfficerMyers.tokens.ward).toBe(1);
        });

        it('allow a card from the non-active house to be played on scrap', function () {
            this.player1.scrap(this.missileOfficerMyers);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');

            this.player1.play(this.exhume);
            this.player1.clickCard(this.gub);
            this.player1.clickPrompt('Left');

            expect(this.player1.amber).toBe(2);
            expect(this.missileOfficerMyers.location).toBe('discard');
            expect(this.exhume.location).toBe('discard');
            expect(this.gub.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');

            this.player1.clickCard(this.legerdemain);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
