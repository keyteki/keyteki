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

    describe('Suspended Animation with abduction', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['snufflegator'],
                    hand: ['suspended-animation', 'ammonia-clouds', 'yzphyz-knowdrone']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it("should return abducted creature to owner's hand when purged from archives", function () {
            this.player1.play(this.ammoniaClouds);
            this.player1.play(this.suspendedAnimation);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('archives');
            expect(this.player1.archives).toContain(this.troll);
            this.player1.playCreature(this.yzphyzKnowdrone);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('hand');
            expect(this.player2.hand).toContain(this.troll);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
