describe('Experiment Q', function () {
    describe("Experiment Q's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['zorg', 'blypyp', 'cxo-taber'],
                    hand: ['experiment-q', 'iyxrenu-the-clever']
                },
                player2: {
                    inPlay: ['troll', 'dust-pixie', 'krump', 'culf-the-quiet']
                }
            });
        });

        it('should get +1 power for each Mars creature in play', function () {
            this.player1.playCreature(this.experimentQ);
            expect(this.experimentQ.power).toBe(8); // Base 5 + 3 Mars creatures (including itself)
        });

        it('should stun a non-Mars creature for each Mars creature when played', function () {
            this.player1.play(this.experimentQ);
            expect(this.player1).toHavePrompt('Choose a non-Mars creature to stun');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.culfTheQuiet);
            expect(this.player1).toBeAbleToSelect(this.cxoTaber);
            expect(this.player1).not.toBeAbleToSelect(this.zorg);
            expect(this.player1).not.toBeAbleToSelect(this.blypyp);
            expect(this.player1).not.toBeAbleToSelect(this.experimentQ);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickCard(this.cxoTaber);
            expect(this.troll.stunned).toBe(true);
            expect(this.dustPixie.stunned).toBe(true);
            expect(this.cxoTaber.stunned).toBe(true);
            expect(this.culfTheQuiet.stunned).toBe(false);
            expect(this.krump.stunned).toBe(false);
            expect(this.experimentQ.stunned).toBe(false);
            expect(this.blypyp.stunned).toBe(false);
            expect(this.zorg.stunned).toBe(false);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should update power when Mars creatures enter play', function () {
            this.player1.playCreature(this.experimentQ);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickCard(this.cxoTaber);
            expect(this.experimentQ.power).toBe(8); // Base 5 + 3 Mars creatures
            this.player1.playCreature(this.iyxrenuTheClever);
            expect(this.experimentQ.power).toBe(9); // Base 5 + 4 Mars creatures
        });

        it('should update power when Mars creatures leave play', function () {
            this.player1.playCreature(this.experimentQ);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickCard(this.cxoTaber);
            expect(this.experimentQ.power).toBe(8); // Base 5 + 3 Mars creatures
            this.player1.moveCard(this.zorg, 'discard');
            expect(this.experimentQ.power).toBe(7); // Base 5 + 2 Mars creatures
        });

        it('should not stun anything if there are no non-Mars creatures', function () {
            this.player1.moveCard(this.troll, 'discard');
            this.player1.moveCard(this.dustPixie, 'discard');
            this.player1.moveCard(this.krump, 'discard');
            this.player1.moveCard(this.culfTheQuiet, 'discard');
            this.player1.moveCard(this.cxoTaber, 'discard');
            this.player1.playCreature(this.experimentQ);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
