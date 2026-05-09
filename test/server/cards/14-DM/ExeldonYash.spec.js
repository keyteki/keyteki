describe('Exeldon Yash', function () {
    describe("Exeldon Yash's ability when opponent has 3 amber", function () {
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

        it('captures 2, then discarding moves 1 from Exeldon Yash to pool', function () {
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

        it('captures 2 and skips discard when player declines, leaving Exeldon Yash with 2', function () {
            this.player1.reap(this.exeldonYash);
            this.player1.clickPrompt('Done');
            expect(this.exeldonYash.amber).toBe(2);
            expect(this.troll.location).toBe('hand');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Exeldon Yash's ability when opponent has 2 amber", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['troll'],
                    inPlay: ['exeldon-yash']
                },
                player2: {
                    amber: 2
                }
            });
        });

        it('captures 2 and discarding moves 1 from Exeldon Yash to pool', function () {
            this.player1.reap(this.exeldonYash);
            expect(this.exeldonYash.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card');
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.exeldonYash.amber).toBe(1);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Exeldon Yash's ability when opponent has 1 amber", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['troll'],
                    inPlay: ['exeldon-yash']
                },
                player2: {
                    amber: 1
                }
            });
        });

        it('captures only 1, so discarding does not move amber from Exeldon Yash', function () {
            this.player1.reap(this.exeldonYash);
            expect(this.exeldonYash.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card');
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.exeldonYash.amber).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Exeldon Yash's ability when opponent has 0 amber", function () {
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

        it('captures nothing, so discarding does not move amber from Exeldon Yash', function () {
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

    describe("Exeldon Yash's ability when Exeldon Yash already has amber", function () {
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

        it('does not move pre-existing amber from Exeldon Yash when capture is 0', function () {
            this.player1.reap(this.exeldonYash);
            expect(this.exeldonYash.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card');
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.exeldonYash.amber).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Exeldon Yash's ability when player has no cards to discard", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    inPlay: ['exeldon-yash']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('captures 2 and ends without moving amber when there is nothing to discard', function () {
            this.player1.reap(this.exeldonYash);
            expect(this.exeldonYash.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
