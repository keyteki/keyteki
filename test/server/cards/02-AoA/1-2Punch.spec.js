describe('1-2 Punch', function () {
    describe("1-2 Punch's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll', 'mighty-tiger', 'dextre'],
                    hand: ['1-2-punch', 'tremor']
                },
                player2: {
                    inPlay: ['commander-remiel', 'bulwark', 'sequis']
                }
            });
            this.punch = this.player1.findCardByName('1-2-punch');
        });

        it('should stun unstunned creatures', function () {
            this.player1.play(this.punch);
            this.player1.clickCard(this.sequis);
            expect(this.sequis.stunned).toBe(true);
        });

        it('should destroy stunned creatures', function () {
            this.player1.play(this.tremor);
            this.player1.clickCard(this.bulwark);
            this.player1.play(this.punch);
            this.player1.clickCard(this.sequis);
            expect(this.sequis.location).toBe('discard');
        });
    });
});
