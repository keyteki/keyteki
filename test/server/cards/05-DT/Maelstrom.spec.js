describe('Mælstrom', function () {
    describe("Mælstrom's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'unfathomable',
                    inPlay: ['hookmaster', 'marshal-ewer', 'alaka', 'groke', 'krump'],
                    hand: ['mælstrom']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens', 'lamindra']
                }
            });
        });

        it('should move each creature to its owners deck', function () {
            this.player1.play(this.mælstrom);
            expect(this.hookmaster.location).toBe('deck');
            expect(this.marshalEwer.location).toBe('deck');
            expect(this.alaka.location).toBe('deck');
            expect(this.groke.location).toBe('deck');
            expect(this.krump.location).toBe('deck');
            expect(this.murkens.location).toBe('deck');
            expect(this.lamindra.location).toBe('deck');

            expect(this.player1.chains).toBe(2);

            //Is it random? Uncomment this and run the test a few times to find out!
            //for(var i = 0; i < 5; i++)
            //    console.log(this.player1.deck[i].name);
        });
    });
});
