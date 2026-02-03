describe('Bingle Bangbang', function () {
    describe("Bingle Bangbang's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['bingle-bangbang']
                },
                player2: {
                    inPlay: ['alaka', 'krump', 'smaaash', 'troll', 'badger']
                }
            });
        });

        it('should deal 5 damage to neighbors of the creature being fought before fight', function () {
            this.player1.fightWith(this.bingleBangbang, this.smaaash);
            expect(this.alaka.damage).toBe(0);
            expect(this.krump.damage).toBe(5);
            expect(this.smaaash.damage).toBe(2);
            expect(this.troll.damage).toBe(5);
            expect(this.badger.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
