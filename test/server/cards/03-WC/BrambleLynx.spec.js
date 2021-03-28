describe('Bramble Lynx', function () {
    describe("Bramble Lynx's constant ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['flaxia'],
                    hand: ['bramble-lynx']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should not enter ready since no creature reaped this turn', function () {
            this.player1.playCreature(this.brambleLynx);
            expect(this.brambleLynx.exhausted).toBe(true);
        });

        it('should enter play read if a creature reaps', function () {
            this.player1.reap(this.flaxia);
            this.player1.playCreature(this.brambleLynx);
            expect(this.brambleLynx.exhausted).toBe(false);
        });

        it('should be valid only for one turn', function () {
            this.player1.reap(this.flaxia);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.troll);
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.playCreature(this.brambleLynx);
            expect(this.brambleLynx.exhausted).toBe(true);
        });
    });
});
