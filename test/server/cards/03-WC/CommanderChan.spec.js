describe('Commander Chan', function () {
    describe("Commander Chan's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['commander-remiel', 'commander-chan', 'lieutenant-khrkhar']
                },
                player2: {
                    inPlay: ['mighty-tiger', 'grabber-jammer', 'dust-pixie']
                }
            });
        });
        it('should allow using friendly creature when you reap', function () {
            this.player1.reap(this.lieutenantKhrkhar);
            expect(this.lieutenantKhrkhar.exhausted).toBe(true);
            this.player1.reap(this.commanderChan);
            expect(this.player1).toHavePrompt('Commander Chan');
            expect(this.player1).toBeAbleToSelect(this.commanderRemiel);
            expect(this.player1).not.toBeAbleToSelect(this.lieutenantKhrkhar);
            this.player1.clickCard(this.commanderRemiel);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1.amber).toBe(3);
        });
        it('should allow using friendly creature when you fight', function () {
            this.player1.reap(this.lieutenantKhrkhar);
            expect(this.lieutenantKhrkhar.exhausted).toBe(true);
            this.player1.fightWith(this.commanderChan, this.dustPixie);
            expect(this.player1).toHavePrompt('Commander Chan');
            expect(this.player1).toBeAbleToSelect(this.commanderRemiel);
            expect(this.player1).not.toBeAbleToSelect(this.lieutenantKhrkhar);
            this.player1.clickCard(this.commanderRemiel);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1.amber).toBe(2);
            expect(this.dustPixie.location).toBe('discard');
        });
    });
});
