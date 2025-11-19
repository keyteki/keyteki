describe('Battlefield Evangelist', function () {
    describe("Battlefield Evangelist's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    token: 'b0-t',
                    amber: 1,
                    inPlay: ['battlefield-evangelist'],
                    hand: ['flaxia', 'sensor-chief-garcia']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should make a token creature after fight', function () {
            this.player1.moveCard(this.flaxia, 'deck');
            this.player1.fightWith(this.battlefieldEvangelist, this.gub);
            this.player1.clickPrompt('Right');
            expect(this.battlefieldEvangelist.location).toBe('play area');
            expect(this.flaxia.location).toBe('play area');
            expect(this.flaxia.name).toBe('B0-T');
        });
    });
});
