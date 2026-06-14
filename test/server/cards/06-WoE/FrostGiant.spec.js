describe('Frost Giant', function () {
    describe("Frost Giant's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['frost-giant', 'bumpsy'],
                    hand: ['anger']
                },
                player2: {
                    inPlay: ['toad']
                }
            });
        });

        it('should not ready during the ready phase', function () {
            this.player1.fightWith(this.frostGiant, this.toad);
            expect(this.toad.location).toBe('discard');
            this.player1.endTurn();
            expect(this.frostGiant.exhausted).toBe(true);
            expect(this.bumpsy.exhausted).toBe(false);
        });

        it('can be readied with effects', function () {
            this.player1.fightWith(this.frostGiant, this.toad);
            expect(this.toad.location).toBe('discard');
            this.player1.play(this.anger);
            expect(this.player1).toBeAbleToSelect(this.frostGiant);
            this.player1.clickCard(this.frostGiant);
            expect(this.frostGiant.exhausted).toBe(false);
            this.player1.endTurn();
        });
    });

    describe('Frost Giant readied by ability during the ready cards step', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['jargogle', 'ganger-chieftain'],
                    inPlay: ['frost-giant', 'cosmicrux']
                },
                player2: {}
            });
        });

        it('readies Frost Giant via Ganger Chieftain after Cosmicrux kills Jargogle', function () {
            this.frostGiant.exhaust();
            this.player1.playCreature(this.jargogle);
            this.player1.clickCard(this.gangerChieftain);
            this.jargogle.damage = 1;
            this.player1.endTurn();

            this.player1.clickPrompt('Left'); // Ganger Chieftain
            this.player1.clickCard(this.frostGiant);
            expect(this.frostGiant.exhausted).toBe(false);
            expect(this.frostGiant.damage).toBe(1);
            this.player2.clickPrompt('untamed');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
