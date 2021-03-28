describe('Psionic Officer Lang', function () {
    describe("Psionic Officer Lang's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['psionic-officer-lang', 'lieutenant-khrkhar'],
                    discard: ['virtuous-works', 'hexpion']
                },
                player2: {
                    inPlay: ['dust-pixie']
                }
            });
        });
        it('should NOT archive the top card of the deck if the controller reaps', function () {
            this.player1.reap(this.lieutenantKhrkhar);
            this.player1.moveCard(this.hexpion, 'deck');
            expect(this.hexpion.location).toBe('deck');
        });
        it('should archive the top card of the deck if the opponent reaps', function () {
            this.player1.endTurn();
            this.player1.moveCard(this.hexpion, 'deck');
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.dustPixie);
            expect(this.hexpion.location).toBe('archives');
        });
    });
});
