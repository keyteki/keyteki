describe('Securi-Droid', function () {
    describe("Securi-Droid's creature mode", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['securi-droid']
                },
                player2: {}
            });
        });

        it('has taunt as a creature', function () {
            expect(this.securiDroid.getKeywordValue('taunt')).toBe(1);
        });
    });

    describe("Securi-Droid's upgrade mode", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['securi-droid'],
                    inPlay: ['squire-alys']
                },
                player2: {}
            });
        });

        it('can be played as an upgrade granting taunt', function () {
            this.player1.playUpgrade(this.securiDroid, this.squireAlys);
            expect(this.securiDroid.parent).toBe(this.squireAlys);
            expect(this.squireAlys.getKeywordValue('taunt')).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
