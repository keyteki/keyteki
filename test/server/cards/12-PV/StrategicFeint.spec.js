describe('Strategic Feint', function () {
    describe("Strategic Feint's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'staralliance',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['strategic-feint'],
                    inPlay: ['ember-imp']
                },
                player2: {
                    amber: 2,
                    hand: ['troll', 'anger', 'brammo'],
                    inPlay: ['krump', 'pelf']
                }
            });
        });

        it('should deal 1 damage and exhaust two enemy creatures', function () {
            this.player1.play(this.strategicFeint);
            expect(this.player1).toHavePrompt('Choose 2 creatures');
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            this.player1.clickCard(this.krump);
            this.player1.clickCard(this.pelf);
            this.player1.clickPrompt('Done');
            expect(this.krump.damage).toBe(1);
            expect(this.pelf.damage).toBe(1);
            expect(this.krump.exhausted).toBe(true);
            expect(this.pelf.exhausted).toBe(true);
        });

        it('should prevent playing cards of the discarded type when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.strategicFeint);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.moveCard(this.troll, 'deck');
            this.player2.reap(this.krump);
            expect(this.troll.location).toBe('discard');
            this.player2.clickCard(this.brammo);
            expect(this.player2).toHavePromptButton('Discard this card');
            expect(this.player2).toHavePromptButton('Cancel');
            expect(this.player2).not.toHavePromptButton('Play this creature');
            this.player2.clickPrompt('Cancel');
            this.player2.play(this.anger);
            this.player2.clickCard(this.krump);
            this.player2.clickCard(this.emberImp);
            expect(this.player2).isReadyToTakeAction();
            this.player2.endTurn();
            this.player1.clickPrompt('staralliance');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.playCreature(this.brammo);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
