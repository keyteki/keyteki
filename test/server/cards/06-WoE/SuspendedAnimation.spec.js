describe('Suspended Animation', function () {
    describe("Suspended Animation's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['snufflegator'],
                    hand: ['suspended-animation', 'ammonia-clouds']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy', 'sir-bevor']
                }
            });
        });

        it('should do nothing when the opponent has no damaged creatures', function () {
            this.player1.play(this.suspendedAnimation);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should put damaged enemy creatures in the archive', function () {
            this.player1.play(this.ammoniaClouds);
            this.player1.play(this.suspendedAnimation);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.sirBevor);
            expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('archives');
            expect(this.player1.archives).toContain(this.troll);
        });
    });
});
