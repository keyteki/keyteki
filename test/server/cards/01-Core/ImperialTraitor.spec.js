describe('Imperial Traitor', function () {
    describe("Imperial Traitor's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['imperial-traitor'],
                    inPlay: []
                },
                player2: {
                    hand: ['champion-anaphiel', 'troll', 'lady-maxena']
                }
            });
        });

        it('should allow purging a Sanctum card from opponent hand', function () {
            this.player1.play(this.imperialTraitor);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            expect(this.player1).toBeAbleToSelect(this.ladyMaxena);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.championAnaphiel);
            this.player1.clickPrompt('Done');
            expect(this.championAnaphiel.location).toBe('purged');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow choosing not to purge', function () {
            this.player1.play(this.imperialTraitor);
            this.player1.clickPrompt('Done');
            expect(this.championAnaphiel.location).toBe('hand');
            expect(this.ladyMaxena.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
