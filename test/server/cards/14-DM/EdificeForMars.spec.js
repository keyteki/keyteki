describe('Edifice for Mars', function () {
    describe("Edifice for Mars's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['edifice-for-mars'],
                    inPlay: ['urchin', 'lifeward']
                },
                player2: {
                    inPlay: ['library-of-babble']
                }
            });
        });

        it('can target an enemy non-Mars artifact', function () {
            this.urchin.exhausted = true;
            this.player1.play(this.edificeForMars);
            expect(this.player1).toBeAbleToSelect(this.libraryOfBabble);
            expect(this.player1).toBeAbleToSelect(this.lifeward);
            this.player1.clickCard(this.libraryOfBabble);
            expect(this.libraryOfBabble.location).toBe('discard');
            this.player1.clickCard(this.urchin);
            expect(this.urchin.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can target a friendly non-Mars artifact', function () {
            this.urchin.exhausted = true;
            this.player1.play(this.edificeForMars);
            expect(this.player1).toBeAbleToSelect(this.lifeward);
            this.player1.clickCard(this.lifeward);
            expect(this.lifeward.location).toBe('discard');
            this.player1.clickCard(this.urchin);
            expect(this.urchin.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
