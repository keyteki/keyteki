describe('Twilight Pixie', function () {
    describe("Twilight Pixie's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    token: 'twilight-pixie',
                    inPlay: ['hunting-witch', 'twilight-pixie:toad', 'dust-pixie', 'mushroom-man']
                },
                player2: {
                    amber: 2
                }
            });

            this.twilightPixie1 = this.player1.player.creaturesInPlay[1];
        });

        it('should let non-faerie neighbors reap for 1', function () {
            this.player1.reap(this.huntingWitch);
            expect(this.player1.amber).toBe(3);
            this.player1.reap(this.twilightPixie);
            expect(this.player1.amber).toBe(4);
            this.player1.reap(this.dustPixie);
            expect(this.player1.amber).toBe(5);
            this.player1.reap(this.mushroomMan);
            expect(this.player1.amber).toBe(6);
        });
    });
});
