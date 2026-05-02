describe('KrisperRuld', function () {
    describe("Krisper Ruld's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    inPlay: ['krisper-ruld', 'autocannon']
                },
                player2: {
                    inPlay: ['flaxia', 'valdr', 'city-gates']
                }
            });
        });

        it('takes control of an enemy artifact after fighting', function () {
            this.player1.fightWith(this.krisperRuld, this.flaxia);
            expect(this.player1).toHavePrompt('Choose a artifact');
            expect(this.player1).not.toBeAbleToSelect(this.autocannon);
            expect(this.player1).toBeAbleToSelect(this.cityGates);
            this.player1.clickCard(this.cityGates);
            expect(this.cityGates.controller).toBe(this.player1.player);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing if there are no enemy artifacts', function () {
            this.player2.moveCard(this.cityGates, 'discard');
            this.player1.fightWith(this.krisperRuld, this.flaxia);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not take control of an artifact when destroyed', function () {
            this.player1.fightWith(this.krisperRuld, this.valdr);
            expect(this.krisperRuld.location).toBe('discard');
            expect(this.cityGates.controller).toBe(this.player2.player);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
