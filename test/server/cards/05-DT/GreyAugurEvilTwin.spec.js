describe('Grey Augur Evil Twin', function () {
    describe("Grey Augur Evil Twin's effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 1,
                    inPlay: ['bulwark', 'grey-augur-evil-twin', 'champion-anaphiel']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra', 'murkens']
                }
            });
        });

        it('reaping with it should not gain 1A and exalt', function () {
            this.player1.reap(this.greyAugurEvilTwin);
            expect(this.player1.amber).toBe(2);
            expect(this.bulwark.amber).toBe(0);
            expect(this.greyAugurEvilTwin.amber).toBe(0);
            expect(this.championAnaphiel.amber).toBe(0);
        });

        it('reaping with its neighbors should gain 1 Aand exalt', function () {
            this.player1.reap(this.bulwark);
            this.player1.reap(this.championAnaphiel);
            expect(this.player1.amber).toBe(5);
            expect(this.bulwark.amber).toBe(1);
            expect(this.greyAugurEvilTwin.amber).toBe(0);
            expect(this.championAnaphiel.amber).toBe(1);
        });
    });
});
