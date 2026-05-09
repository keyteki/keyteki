describe('Skullion', function () {
    describe("Skullion's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['skullion'],
                    inPlay: ['troll', 'lamindra']
                },
                player2: {
                    inPlay: ['krump']
                }
            });
        });

        it('sacrifices a chosen friendly creature on play', function () {
            this.player1.play(this.skullion);
            expect(this.player1).toHavePrompt('Choose a creature to sacrifice');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.skullion);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.lamindra.location).toBe('play area');
            expect(this.skullion.location).toBe('play area');
            expect(this.krump.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('can sacrifice itself', function () {
            this.player1.play(this.skullion);
            this.player1.clickCard(this.skullion);
            expect(this.skullion.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
