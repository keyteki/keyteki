fdescribe('Badge of Unity', function () {
    describe("Badge of Unity's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['troll'],
                    hand: ['badge-of-unity']
                },
                player2: {
                    hand: ['dextre']
                }
            });
        });

        it('should treat the upgraded creature as Star Alliance', function () {
            this.player1.playUpgrade(this.badgeOfUnity, this.troll);
            expect(this.troll.hasHouse('staralliance')).toBe(true);
            expect(this.troll.hasHouse('brobnar')).toBe(true);
        });
    });
});
