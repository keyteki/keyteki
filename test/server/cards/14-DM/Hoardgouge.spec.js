describe('Hoardgouge', function () {
    describe("Hoardgouge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    hand: ['hoardgouge'],
                    inPlay: ['caspart']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy', 'urchin']
                }
            });
        });

        it('gains 1 and deals 3 to enemy creature when overwhelmed on reap', function () {
            this.player1.playUpgrade(this.hoardgouge, this.caspart);
            const before = this.player1.amber;
            this.player1.reap(this.caspart);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            // amber: reap (+1) + ability (+1)
            expect(this.player1.amber).toBe(before + 2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing when not overwhelmed', function () {
            this.player2.moveCard(this.troll, 'discard');
            this.player2.moveCard(this.bumpsy, 'discard');
            this.player2.moveCard(this.urchin, 'discard');
            this.player1.playUpgrade(this.hoardgouge, this.caspart);
            const before = this.player1.amber;
            this.player1.reap(this.caspart);
            expect(this.player1.amber).toBe(before + 1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
