describe('Administrator Pelith', function () {
    describe("Administrator Pelith's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['administrator-pelith', 'troll', 'blypyp', 'krump', 'barrister-joya']
                },
                player2: {
                    inPlay: ['dust-pixie', 'almsmaster']
                }
            });
        });

        it('should allow moving a friendly Sanctum creature after reaping', function () {
            this.player1.reap(this.administratorPelith);
            this.player1.clickCard(this.administratorPelith);
            expect(this.player1).toBeAbleToSelect(this.barristerJoya);
            expect(this.player1).toBeAbleToSelect(this.administratorPelith);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.blypyp);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.almsmaster);
            this.player1.clickCard(this.barristerJoya);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Right');
            expect(this.barristerJoya.neighbors).toContain(this.troll);
            expect(this.barristerJoya.neighbors).toContain(this.blypyp);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should be optional', function () {
            this.player1.reap(this.administratorPelith);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
