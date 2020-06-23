describe('Barn Razing', function () {
    describe("Barn Razing's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'brobnar',
                    hand: ['barn-razing'],
                    inPlay: ['ganger-chieftain', 'troll'],
                    discard: ['tocsin', 'batdrone']
                },
                player2: {
                    amber: 4,
                    inPlay: ['duskwitch', 'dew-faerie', 'kindrith-longshot'],
                    discard: ['flaxia', 'nexus']
                }
            });
        });
        it('should cause opponent to lose 1A each time a friendly creature fights', function () {
            this.player1.play(this.barnRazing);
            this.player1.fightWith(this.gangerChieftain, this.duskwitch);
            expect(this.player2.amber).toBe(3);
            expect(this.player1.amber).toBe(4);
            this.player1.fightWith(this.troll, this.dewFaerie);
            expect(this.player2.amber).toBe(2);
            expect(this.player1.amber).toBe(4);
        });
    });
});
