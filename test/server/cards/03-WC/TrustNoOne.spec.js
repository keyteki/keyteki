describe('Trust No One', function () {
    describe("Trust No One's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'shadows',
                    hand: ['trust-no-one', 'virtuous-works', 'chuff-ape'],
                    inPlay: ['sequis', 'mindwarper', 'blypyp']
                },
                player2: {
                    amber: 5
                }
            });
        });

        it('should steal 1A when I have creatures in play.', function () {
            this.player1.play(this.trustNoOne);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(4);
            this.expectReadyToTakeAction(this.player1);
        });
    });

    describe("Trust No One's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'shadows',
                    hand: ['trust-no-one', 'virtuous-works', 'chuff-ape']
                },
                player2: {
                    amber: 5
                }
            });
        });

        it('should steal 1A for each house rep by opp when I have no creatures in play. [0]', function () {
            this.player1.play(this.trustNoOne);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(5);
            this.expectReadyToTakeAction(this.player1);
        });
    });

    describe("Trust No One's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'shadows',
                    hand: ['trust-no-one', 'virtuous-works', 'chuff-ape']
                },
                player2: {
                    amber: 5,
                    inPlay: ['mother']
                }
            });
        });

        it('should steal 1A for each house rep by opp when I have no creatures in play. [1]', function () {
            this.player1.play(this.trustNoOne);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(4);
            this.expectReadyToTakeAction(this.player1);
        });
    });

    describe("Trust No One's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'shadows',
                    hand: ['trust-no-one', 'virtuous-works', 'chuff-ape']
                },
                player2: {
                    amber: 5,
                    inPlay: ['mother', 'sequis']
                }
            });
        });

        it('should steal 1A for each house rep by opp when I have no creatures in play. [2]', function () {
            this.player1.play(this.trustNoOne);
            expect(this.player1.amber).toBe(6);
            expect(this.player2.amber).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });
    });

    describe("Trust No One's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'shadows',
                    hand: ['trust-no-one', 'virtuous-works', 'chuff-ape']
                },
                player2: {
                    amber: 5,
                    inPlay: ['mother', 'sequis', 'rustgnawer']
                }
            });
        });

        it('should steal 1A (max 3) for each house rep by opp when I have no creatures in play. [3]', function () {
            this.player1.play(this.trustNoOne);
            expect(this.player1.amber).toBe(7);
            expect(this.player2.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
