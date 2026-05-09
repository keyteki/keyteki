describe('Persistence Hunting', function () {
    describe("Persistence Hunting's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['persistence-hunting'],
                    inPlay: ['lamindra']
                },
                player2: {
                    inPlay: ['troll', 'krump', 'urchin']
                }
            });
        });

        it('exhausts each enemy creature of the chosen house', function () {
            this.player1.play(this.persistenceHunting);
            expect(this.player1).toHavePrompt('Choose a house');
            this.player1.clickPrompt('brobnar');
            expect(this.troll.exhausted).toBe(true);
            expect(this.krump.exhausted).toBe(true);
            expect(this.urchin.exhausted).toBe(false);
            expect(this.lamindra.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not exhaust friendly creatures of the chosen house', function () {
            this.player1.play(this.persistenceHunting);
            this.player1.clickPrompt('shadows');
            expect(this.urchin.exhausted).toBe(true);
            expect(this.lamindra.exhausted).toBe(false);
            expect(this.troll.exhausted).toBe(false);
            expect(this.krump.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing when no enemy creatures match the chosen house', function () {
            this.player1.play(this.persistenceHunting);
            this.player1.clickPrompt('untamed');
            expect(this.troll.exhausted).toBe(false);
            expect(this.krump.exhausted).toBe(false);
            expect(this.urchin.exhausted).toBe(false);
            expect(this.lamindra.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
