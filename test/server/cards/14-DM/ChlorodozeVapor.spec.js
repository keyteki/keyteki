describe('Chlorodoze Vapor', function () {
    describe("Chlorodoze Vapor's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    hand: ['chlorodoze-vapor'],
                    inPlay: ['noxious-ionox']
                },
                player2: {
                    inPlay: ['urchin', 'troll']
                }
            });
        });

        it('deals 3 to each creature and exhausts one per destroyed', function () {
            // Urchin has 1 power - destroyed; troll has 8 - survives; noxious-ionox has 4 - survives
            this.player1.play(this.chlorodozeVapor);
            expect(this.urchin.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
            expect(this.noxiousIonox.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Done');
            expect(this.troll.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('no exhaust prompt when no creature destroyed', function () {
            this.player2.moveCard(this.urchin, 'discard');
            this.player1.play(this.chlorodozeVapor);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
