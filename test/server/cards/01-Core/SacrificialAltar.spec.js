describe('Sacrificial Altar', function () {
    describe("Sacrificial Altar's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['sacrificial-altar', 'ember-imp', 'jehu-the-bureaucrat'],
                    discard: ['shooler']
                },
                player2: {}
            });
        });

        it('should purge a Human creature and play a creature from discard', function () {
            this.player1.useAction(this.sacrificialAltar);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.jehuTheBureaucrat);
            this.player1.clickCard(this.jehuTheBureaucrat);
            expect(this.jehuTheBureaucrat.location).toBe('purged');
            expect(this.player1).toBeAbleToSelect(this.shooler);
            this.player1.clickCard(this.shooler);
            this.player1.clickPrompt('Right');
            expect(this.shooler.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
