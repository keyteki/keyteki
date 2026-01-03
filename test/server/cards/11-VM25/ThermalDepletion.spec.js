describe('Thermal Depletion', function () {
    describe("Thermal Depletion's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['thermal-depletion'],
                    inPlay: ['troll']
                },
                player2: {
                    amber: 1,
                    hand: ['reap-or-sow'],
                    inPlay: ['dust-pixie']
                }
            });
        });

        it('should prevent creatures from readying until the start of your next turn', function () {
            this.player1.reap(this.troll);
            this.player1.play(this.thermalDepletion);
            this.player1.endTurn();
            expect(this.troll.exhausted).toBe(true);
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.dustPixie);
            this.player2.play(this.reapOrSow);
            this.player2.clickPrompt('Ready and reap');
            this.player2.clickCard(this.dustPixie);
            expect(this.player2.amber).toBe(2); // no amber from reap since the creature couldn't ready
            this.expectReadyToTakeAction(this.player2);
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            expect(this.troll.exhausted).toBe(true);
            expect(this.dustPixie.exhausted).toBe(true);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            expect(this.troll.exhausted).toBe(false);
            expect(this.dustPixie.exhausted).toBe(false);
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'brobnar',
                    hand: ['thermal-depletion'],
                    inPlay: ['tachyon-manifold', 'troll']
                },
                player2: {
                    amber: 0,
                    hand: [],
                    inPlay: ['teliga']
                }
            });
            this.tachyonManifold.maverick = 'brobnar';
            this.tachyonManifold.printedHouse = 'brobnar';
            this.player1.useAction(this.tachyonManifold);
        });

        it("should not affect player's next turn", function () {
            this.player1.reap(this.troll);
            this.player1.play(this.thermalDepletion);
            this.player1.endTurn();
            this.player1.clickPrompt('brobnar');
            expect(this.troll.exhausted).toBe(true);
            this.player1.endTurn();
            expect(this.troll.exhausted).toBe(false);
            this.player2.clickPrompt('untamed');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
