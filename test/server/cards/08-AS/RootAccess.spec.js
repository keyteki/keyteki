describe('Root Access', function () {
    describe("Root Access's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['urchin', 'groke'],
                    hand: ['root-access']
                },
                player2: {
                    inPlay: ['pelf', 'batdrone', 'skullback-crab'],
                    hand: ['anger']
                }
            });
        });

        it('should discard bottom card and deal enemy damage', function () {
            this.player2.moveCard(this.anger, 'deck bottom');
            this.player1.play(this.rootAccess);
            expect(this.anger.location).toBe('discard');
            expect(this.pelf.damage).toBe(2);
            expect(this.batdrone.damage).toBe(0);
            expect(this.skullbackCrab.damage).toBe(0);
            expect(this.urchin.damage).toBe(0);
            expect(this.groke.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing if deck is empty', function () {
            this.player2.player.deck = [];
            this.player1.play(this.rootAccess);
            expect(this.pelf.damage).toBe(0);
            expect(this.batdrone.damage).toBe(0);
            expect(this.skullbackCrab.damage).toBe(0);
            expect(this.urchin.damage).toBe(0);
            expect(this.groke.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
