describe('Barrel Roll', function () {
    describe("Barrel Roll's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    hand: ['barrel-roll'],
                    inPlay: ['flip-stallard']
                },
                player2: {
                    inPlay: ['troll', 'krump', 'bumpsy']
                }
            });
        });

        it('moves a friendly creature to a flank and exhausts it', function () {
            this.player1.play(this.barrelRoll);
            this.player1.clickCard(this.flipStallard);
            this.player1.clickPrompt('Left');
            expect(this.flipStallard.exhausted).toBe(true);
            expect(this.flipStallard.isOnFlank()).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('moves an enemy creature to a flank of its controller and exhausts it', function () {
            this.player1.play(this.barrelRoll);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Right');
            expect(this.krump.exhausted).toBe(true);
            expect(this.krump.isOnFlank()).toBe(true);
            expect(this.troll.location).toBe('play area');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
