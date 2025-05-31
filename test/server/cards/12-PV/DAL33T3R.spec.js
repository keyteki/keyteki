describe('DAL-33-T3R', function () {
    describe("DAL-33-T3R's ability", function () {
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
                    inPlay: ['dal-33-t3r', 'culf-the-quiet']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump', 'ember-imp', 'brutodon-auxiliary']
                }
            });
        });

        it('should return 2 enemy creatures to hand after reap', function () {
            this.player1.reap(this.dal33T3r);
            expect(this.player1).toBeAbleToSelect(this.brutodonAuxiliary);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).not.toBeAbleToSelect(this.culfTheQuiet);
            expect(this.player1).not.toBeAbleToSelect(this.dal33T3r);
            this.player1.clickCard(this.brutodonAuxiliary);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Done');
            expect(this.brutodonAuxiliary.location).toBe('hand');
            expect(this.krump.location).toBe('hand');
            expect(this.emberImp.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should purge the most powerful friendly creature when fate is triggered', function () {
            this.player1.moveCard(this.dal33T3r, 'hand');
            this.player1.activateProphecy(this.overreach, this.dal33T3r);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.player2).toBeAbleToSelect(this.brutodonAuxiliary);
            expect(this.player2).toBeAbleToSelect(this.krump);
            expect(this.player2).not.toBeAbleToSelect(this.emberImp);
            expect(this.player2).not.toBeAbleToSelect(this.culfTheQuiet);
            this.player2.clickCard(this.brutodonAuxiliary);
            expect(this.brutodonAuxiliary.location).toBe('purged');
            expect(this.krump.location).toBe('play area');
            expect(this.dal33T3r.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
