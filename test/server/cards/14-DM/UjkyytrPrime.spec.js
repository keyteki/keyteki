describe('Ujkyytr Prime', function () {
    describe("Ujkyytr Prime's reap when not overwhelmed", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['ujkyytr-prime', 'iyxrenu-the-clever', 'john-smyth']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy']
                }
            });
        });

        it('stuns any creature (friendly or enemy) when not overwhelmed', function () {
            this.player1.reap(this.ujkyytrPrime);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.iyxrenuTheClever);
            expect(this.player1).toBeAbleToSelect(this.johnSmyth);
            this.player1.clickCard(this.troll);
            expect(this.troll.stunned).toBe(true);
            expect(this.bumpsy.stunned).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Ujkyytr Prime's reap when overwhelmed", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['ujkyytr-prime']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy', 'krump']
                }
            });
        });

        it('stuns target enemy and its neighbors, friendly creatures not selectable', function () {
            this.player1.reap(this.ujkyytrPrime);
            // friendly cannot be targeted when overwhelmed
            expect(this.player1).not.toBeAbleToSelect(this.ujkyytrPrime);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.bumpsy);
            // bumpsy is middle: neighbors are troll and krump
            expect(this.bumpsy.stunned).toBe(true);
            expect(this.troll.stunned).toBe(true);
            expect(this.krump.stunned).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
