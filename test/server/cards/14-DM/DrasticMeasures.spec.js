describe('DrasticMeasures', function () {
    describe("Drastic Measures's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['drastic-measures', 'troll', 'krump']
                }
            });
        });

        it('purges 2 cards and gains 2 amber', function () {
            this.player1.play(this.drasticMeasures);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Done');
            expect(this.troll.location).toBe('purged');
            expect(this.krump.location).toBe('purged');
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('purges 1 card and gains 1 amber', function () {
            this.player1.play(this.drasticMeasures);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Done');
            expect(this.troll.location).toBe('purged');
            expect(this.krump.location).toBe('hand');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('purges 0 cards and gains 0 amber', function () {
            this.player1.play(this.drasticMeasures);
            this.player1.clickPrompt('Done');
            expect(this.troll.location).toBe('hand');
            expect(this.krump.location).toBe('hand');
            expect(this.player1.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Drastic Measures's ability with only one other card in hand", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['drastic-measures', 'troll']
                }
            });
        });

        it('purges the only available card and gains 1 amber', function () {
            this.player1.play(this.drasticMeasures);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Done');
            expect(this.troll.location).toBe('purged');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can decline to purge any card and gains 0 amber', function () {
            this.player1.play(this.drasticMeasures);
            this.player1.clickPrompt('Done');
            expect(this.troll.location).toBe('hand');
            expect(this.player1.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Drastic Measures's ability with no other cards in hand", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['drastic-measures']
                }
            });
        });

        it('resolves with no cards to purge and gains 0 amber', function () {
            this.player1.play(this.drasticMeasures);
            this.player1.clickPrompt('Done');
            expect(this.player1.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
