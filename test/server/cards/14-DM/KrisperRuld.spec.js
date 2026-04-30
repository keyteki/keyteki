describe('KrisperRuld', function () {
    describe("Krisper Ruld's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    inPlay: ['krisper-ruld']
                },
                player2: {
                    inPlay: ['flaxia', 'city-gates']
                }
            });
        });

        it('takes control of an enemy artifact after fighting', function () {
            this.player1.fightWith(this.krisperRuld, this.flaxia);
            expect(this.player1).toHavePrompt('Choose an enemy artifact');
            this.player1.clickCard(this.cityGates);
            expect(this.cityGates.controller).toBe(this.player1.player);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing if there are no enemy artifacts', function () {
            this.player2.moveCard(this.cityGates, 'discard');
            this.player1.fightWith(this.krisperRuld, this.flaxia);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Krisper Ruld's ability when destroyed in fight", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    inPlay: ['krisper-ruld']
                },
                player2: {
                    inPlay: ['valdr', 'city-gates']
                }
            });
        });

        it('does not take control of an artifact when destroyed', function () {
            this.player1.fightWith(this.krisperRuld, this.valdr);
            expect(this.krisperRuld.location).toBe('discard');
            expect(this.cityGates.controller).toBe(this.player2.player);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
