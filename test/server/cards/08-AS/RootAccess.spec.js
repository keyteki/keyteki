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
            expect(this.pelf.tokens.damage).toBe(2);
            expect(this.batdrone.tokens.damage).toBe(undefined);
            expect(this.skullbackCrab.tokens.damage).toBe(undefined);
            expect(this.urchin.tokens.damage).toBe(undefined);
            expect(this.groke.tokens.damage).toBe(undefined);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing if deck is empty', function () {
            this.player2.player.deck = [];
            this.player1.play(this.rootAccess);
            expect(this.pelf.tokens.damage).toBe(undefined);
            expect(this.batdrone.tokens.damage).toBe(undefined);
            expect(this.skullbackCrab.tokens.damage).toBe(undefined);
            expect(this.urchin.tokens.damage).toBe(undefined);
            expect(this.groke.tokens.damage).toBe(undefined);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
