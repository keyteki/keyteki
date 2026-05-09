describe('DRAGONS!!!', function () {
    describe("DRAGONS!!!'s ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    hand: ['dragons'],
                    discard: ['caspart', 'noxious-ionox', 'bumpsy']
                },
                player2: {}
            });
        });

        it('shuffles chosen Dragon creatures from discard into deck', function () {
            this.player1.play(this.dragons);
            expect(this.player1).toHavePrompt('Choose cards');
            this.player1.clickCard(this.caspart);
            this.player1.clickCard(this.noxiousIonox);
            this.player1.clickPrompt('Done');
            expect(this.caspart.location).toBe('deck');
            expect(this.noxiousIonox.location).toBe('deck');
            expect(this.bumpsy.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('can shuffle no creatures', function () {
            this.player1.play(this.dragons);
            this.player1.clickPrompt('Done');
            expect(this.caspart.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
