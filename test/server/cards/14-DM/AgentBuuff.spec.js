describe('Agent Buuff', function () {
    describe("Agent Buuff's reap", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['agent-buuff', 'john-smyth']
                },
                player2: {
                    inPlay: ['troll', 'krump', 'bumpsy']
                }
            });
        });

        it('gives a friendly creature three +1 power counters when overwhelmed', function () {
            this.player1.reap(this.agentBuuff);
            expect(this.player1).toHavePrompt('Choose a friendly creature');
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.johnSmyth);
            expect(this.johnSmyth.powerCounters).toBe(3);
            expect(this.agentBuuff.powerCounters).toBe(0);
            expect(this.troll.powerCounters).toBe(0);
            expect(this.krump.powerCounters).toBe(0);
            expect(this.bumpsy.powerCounters).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('gives each friendly creature a +1 power counter when not overwhelmed', function () {
            this.player2.moveCard(this.bumpsy, 'hand');
            this.player2.moveCard(this.krump, 'hand');
            this.player1.reap(this.agentBuuff);
            expect(this.agentBuuff.powerCounters).toBe(1);
            expect(this.johnSmyth.powerCounters).toBe(1);
            expect(this.troll.powerCounters).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
