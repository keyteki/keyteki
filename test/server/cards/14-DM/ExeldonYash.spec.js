describe('ExeldonYash', function () {
    describe("Exeldon Yash's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['troll'],
                    inPlay: ['exeldon-yash']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('captures 2 then discards a card to move 1 to pool', function () {
            this.player1.reap(this.exeldonYash);
            expect(this.exeldonYash.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card');
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.exeldonYash.amber).toBe(1);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('captures 2 and skips discard when player declines', function () {
            this.player1.reap(this.exeldonYash);
            this.player1.clickPrompt('Done');
            expect(this.exeldonYash.amber).toBe(2);
            expect(this.troll.location).toBe('hand');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Exeldon Yash's ability when opponent has no amber", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['troll'],
                    inPlay: ['exeldon-yash']
                },
                player2: {
                    amber: 0
                }
            });
        });

        it('still prompts to discard but no amber is gained when there is none on Exeldon Yash', function () {
            this.player1.reap(this.exeldonYash);
            expect(this.exeldonYash.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card');
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.exeldonYash.amber).toBe(0);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Exeldon Yash's ability when opponent has no amber but Exeldon Yash has amber on it", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['troll'],
                    inPlay: ['exeldon-yash']
                },
                player2: {
                    amber: 0
                }
            });
            this.exeldonYash.amber = 1;
        });

        it('discards to move the existing amber from Exeldon Yash to pool', function () {
            this.player1.reap(this.exeldonYash);
            expect(this.exeldonYash.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card');
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.exeldonYash.amber).toBe(0);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
