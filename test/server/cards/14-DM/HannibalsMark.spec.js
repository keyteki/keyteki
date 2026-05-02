describe("Hannibal's Mark", function () {
    describe("Hannibal's Mark's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    hand: ['hannibal-s-mark']
                },
                player2: {
                    inPlay: ['troll', 'krump', 'bumpsy']
                }
            });
        });

        it('takes control of an enemy flank creature, makes it Skyborn, and adds 3 power counters', function () {
            this.player1.play(this.hannibalSMark);
            this.player1.clickCard(this.troll);
            expect(this.troll.controller).toBe(this.player1.player);
            expect(this.troll.hasHouse('skyborn')).toBe(true);
            expect(this.troll.powerCounters).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('cannot target a non-flank enemy creature', function () {
            this.player1.play(this.hannibalSMark);
            this.player1.clickCard(this.krump);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.bumpsy);
            expect(this.bumpsy.controller).toBe(this.player1.player);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
