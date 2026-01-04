describe('Fierce Competition', function () {
    describe("Fierce Competition's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    token: 'wrangler',
                    hand: ['fierce-competition']
                },
                player2: {
                    amber: 2
                }
            });

            this.wrangler1 = this.player1.player.deck[0];
        });

        it('should make a token creature on play', function () {
            this.player1.play(this.fierceCompetition);
            expect(this.wrangler1.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should archive if both players have 0 keys', function () {
            this.player1.play(this.fierceCompetition);
            expect(this.fierceCompetition.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should archive if both players have 1 key', function () {
            this.player1.player.keys = { red: true, blue: false, yellow: false };
            this.player2.player.keys = { red: false, blue: true, yellow: false };
            this.player1.play(this.fierceCompetition);
            expect(this.fierceCompetition.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should archive if both players have 2 keys', function () {
            this.player1.player.keys = { red: true, blue: false, yellow: true };
            this.player2.player.keys = { red: false, blue: true, yellow: true };
            this.player1.play(this.fierceCompetition);
            expect(this.fierceCompetition.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not archive if players have different number of keys', function () {
            this.player1.player.keys = { red: true, blue: false, yellow: false };
            this.player2.player.keys = { red: false, blue: true, yellow: true };
            this.player1.play(this.fierceCompetition);
            expect(this.fierceCompetition.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
