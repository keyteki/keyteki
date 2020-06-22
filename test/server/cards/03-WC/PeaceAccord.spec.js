describe('Peace Accord', function () {
    describe("Peace Accord's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'staralliance',
                    inPlay: ['peace-accord', 'lieutenant-khrkhar'],
                    hand: ['hand-of-dis', 'pitlord']
                },
                player2: {
                    amber: 3,
                    inPlay: ['mighty-tiger', 'snufflegator', 'dust-pixie']
                }
            });
        });
        it('should cause a controller who fights to lose 4A and destroy itself', function () {
            this.player1.fightWith(this.lieutenantKhrkhar, this.dustPixie);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            expect(this.peaceAccord.location).toBe('discard');
        });
        it('should cause an opponent who fights to lose 4A and destroy itself', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.mightyTiger, this.lieutenantKhrkhar);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(0);
            expect(this.peaceAccord.location).toBe('discard');
        });
    });
});
