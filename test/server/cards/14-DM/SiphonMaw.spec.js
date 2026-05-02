describe('Siphon Maw', function () {
    describe("Siphon Maw's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['siphon-maw'],
                    hand: ['troll']
                },
                player2: {
                    amber: 5,
                    hand: ['bumpsy']
                }
            });
            this.player1.moveCard(this.troll, 'deck');
            this.player2.moveCard(this.bumpsy, 'deck');
        });

        it("discards top of opponent's deck and opponent loses 1 per bonus icon after reap", function () {
            this.bumpsy.enhancements = ['amber'];
            this.player1.reap(this.siphonMaw);
            this.player1.clickPrompt('Opponent');
            expect(this.bumpsy.location).toBe('discard');
            expect(this.player2.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('discards top of own deck and opponent loses 0 if no bonus icons', function () {
            this.player1.reap(this.siphonMaw);
            this.player1.clickPrompt('Mine');
            expect(this.troll.location).toBe('discard');
            expect(this.player2.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it('discards top of own deck and opponent loses 1 per bonus icon', function () {
            this.troll.enhancements = ['amber', 'capture'];
            this.player1.reap(this.siphonMaw);
            this.player1.clickPrompt('Mine');
            expect(this.troll.location).toBe('discard');
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('counts a draw bonus icon', function () {
            this.troll.enhancements = ['draw'];
            this.player1.reap(this.siphonMaw);
            this.player1.clickPrompt('Mine');
            expect(this.troll.location).toBe('discard');
            expect(this.player2.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('counts a house icon enhancement like mars', function () {
            this.troll.enhancements = ['mars', 'amber'];
            this.player1.reap(this.siphonMaw);
            this.player1.clickPrompt('Mine');
            expect(this.troll.location).toBe('discard');
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
