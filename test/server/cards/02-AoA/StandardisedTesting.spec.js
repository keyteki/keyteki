describe('Standardised Testing', function () {
    describe("Standardised Testing's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['standardized-testing'],
                    inPlay: ['troll', 'urchin', 'magda-the-rat']
                },
                player2: {
                    inPlay: ['groggins', 'lamindra', 'bumpsy']
                }
            });
        });

        it('destroys every creature tied for the highest and lowest power on either side, sparing middle-power creatures', function () {
            this.player1.play(this.standardizedTesting);
            expect(this.troll.location).toBe('discard');
            expect(this.groggins.location).toBe('discard');
            expect(this.urchin.location).toBe('discard');
            expect(this.lamindra.location).toBe('discard');
            expect(this.magdaTheRat.location).toBe('play area');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Standardised Testing with creatures only on the opposing side', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['standardized-testing']
                },
                player2: {
                    inPlay: ['troll', 'krump', 'urchin']
                }
            });
        });

        it('still destroys the highest- and lowest-power creatures when only the opponent has creatures', function () {
            this.player1.play(this.standardizedTesting);
            expect(this.troll.location).toBe('discard');
            expect(this.urchin.location).toBe('discard');
            expect(this.krump.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Standardised Testing with no creatures in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['standardized-testing']
                },
                player2: {}
            });
        });

        it('does nothing when there are no creatures in play', function () {
            this.player1.play(this.standardizedTesting);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
