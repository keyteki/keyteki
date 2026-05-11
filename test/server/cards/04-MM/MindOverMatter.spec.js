describe('Mind Over Matter', function () {
    describe("Mind Over Matter's Play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['mind-over-matter'],
                    inPlay: ['troll', 'urchin']
                },
                player2: {
                    inPlay: ['nexus', 'dodger', 'lamindra']
                }
            });
        });

        it('archives each creature into its owner archives', function () {
            this.player1.play(this.mindOverMatter);
            expect(this.troll.location).toBe('archives');
            expect(this.urchin.location).toBe('archives');
            expect(this.nexus.location).toBe('archives');
            expect(this.dodger.location).toBe('archives');
            expect(this.lamindra.location).toBe('archives');
            expect(this.player1.player.archives.length).toBe(2);
            expect(this.player2.player.archives.length).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
