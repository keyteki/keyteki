describe('Relentless Creeper', function () {
    integration(function () {
        describe("Relentless Creeper's abilities", function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        house: 'untamed',
                        inPlay: ['vineapple-tree', 'gebuk'],
                        hand: ['flaxia', 'reclaimed-by-nature'],
                        discard: ['relentless-creeper']
                    },
                    player2: {
                        inPlay: ['evasion-sigil', 'troll', 'customs-office'],
                        amber: 2
                    }
                });
            });

            it('prompt to return relentless creeper from discard when dis is selected', function () {
                this.player1.endTurn();

                this.player2.clickPrompt('brobnar');
                this.player2.endTurn();

                this.player1.clickPrompt('dis');
                expect(this.player1).toBeAbleToSelect(this.relentlessCreeper);

                this.player1.clickCard(this.relentlessCreeper);
                expect(this.relentlessCreeper.location).toBe('hand');
            });
        });
    });
});
