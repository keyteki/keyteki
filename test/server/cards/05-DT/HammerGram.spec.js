describe('Hammer-gram', function () {
    describe("Hammer-gram's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['grommid', 'narp', 'orb-of-wonder'],
                    hand: ['hammer-gram']
                },
                player2: {
                    inPlay: ['bulwark', 'armsmaster-molina']
                }
            });
        });

        it('should deal 3D damage and stun a creature', function () {
            this.player1.play(this.hammerGram);
            expect(this.player1).toBeAbleToSelect(this.grommid);
            expect(this.player1).toBeAbleToSelect(this.narp);
            expect(this.player1).not.toBeAbleToSelect(this.orbOfWonder);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.armsmasterMolina);
            this.player1.clickCard(this.bulwark);
            expect(this.bulwark.damage).toBe(1);
            expect(this.bulwark.stunned).toBe(true);
        });
    });
});
