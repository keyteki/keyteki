describe('Youngest Bear Evil Twin', function () {
    describe("Youngest Bear Evil Twin' play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['batdrone'],
                    inPlay: ['dust-pixie', 'flaxia', 'youngest-bear-evil-twin', 'mother']
                },
                player2: {
                    amber: 4,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should allow selection of neighboring creatures on reap', function () {
            this.player1.reap(this.youngestBearEvilTwin);

            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.mother);
        });

        it('should allow creature out of house to fight', function () {
            this.player1.reap(this.youngestBearEvilTwin);
            expect(this.player1).toBeAbleToSelect(this.mother);
            this.player1.clickCard(this.mother);
            this.player1.clickCard(this.krump);
            expect(this.mother.location).toBe('discard');
        });

        it('should allow creature in house to fight', function () {
            this.player1.reap(this.youngestBearEvilTwin);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.flaxia);
            this.player1.clickCard(this.krump);
            expect(this.flaxia.location).toBe('discard');
        });
    });
});
