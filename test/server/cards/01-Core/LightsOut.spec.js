describe('Lights Out', function () {
    describe("Lights Out's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['lights-out'],
                    inPlay: ['urchin']
                },
                player2: {
                    inPlay: ['troll', 'krump', 'bumpsy']
                }
            });
        });

        it('should return 2 enemy creatures to their owner hand', function () {
            this.player1.play(this.lightsOut);
            expect(this.player1).toHavePrompt('Lights Out');
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Done');
            expect(this.urchin.location).toBe('play area');
            expect(this.troll.location).toBe('hand');
            expect(this.krump.location).toBe('hand');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
