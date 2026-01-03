describe('Carrion Wyrm', function () {
    describe("Carrion Wyrm's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['carrion-wyrm']
                },
                player2: {
                    inPlay: ['troll', 'krump']
                }
            });
        });

        it('should destroy an enemy creature after reaping', function () {
            this.player1.reap(this.carrionWyrm);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should put an enemy creature on top of deck when scrapped', function () {
            this.player1.moveCard(this.carrionWyrm, 'hand');
            this.player1.scrap(this.carrionWyrm);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.troll);
            expect(this.krump.location).toBe('play area');
            expect(this.troll.location).toBe('deck');
            expect(this.player2.player.deck[0]).toBe(this.troll);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
