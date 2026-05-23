describe('Galeatops', function () {
    describe("Galeatops's persistent effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['galeatops']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('only deals 4D when fighting', function () {
            this.player1.fightWith(this.galeatops, this.troll);
            expect(this.troll.damage).toBe(4);
            expect(this.galeatops.damage).toBe(8);
            expect(this.galeatops.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('only deals 4D when being fought', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.galeatops);
            expect(this.galeatops.damage).toBe(8);
            expect(this.troll.damage).toBe(4);
            expect(this.galeatops.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
