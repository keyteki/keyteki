describe('Yanthi Ghostfin', function () {
    describe("Yanthi Ghostfin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 4,
                    token: 'grumpus',
                    inPlay: ['yanthi-ghostfin', 'earthshaker'],
                    discard: ['seabringer-kekoa', 'stir-crazy', 'ged-hammer']
                },
                player2: {
                    amber: 3,
                    inPlay: ['batdrone', 'mother'],
                    discard: ['helper-bot', 'archimedes', 'eureka']
                }
            });

            this.player1.moveCard(this.gedHammer, 'deck');
        });

        it('should purge a creature from a discard pile', function () {
            this.player1.reap(this.yanthiGhostfin);
            expect(this.player1).toBeAbleToSelect(this.seabringerKekoa);
            expect(this.player1).not.toBeAbleToSelect(this.stirCrazy);
            expect(this.player1).not.toBeAbleToSelect(this.gedHammer);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).toBeAbleToSelect(this.archimedes);
            expect(this.player1).not.toBeAbleToSelect(this.eureka);
            this.player1.clickCard(this.archimedes);
            expect(this.archimedes.location).toBe('purged');
            this.player1.clickPrompt('Right');
            expect(this.gedHammer.location).toBe('play area');
            expect(this.gedHammer.name).toBe('Grumpus');
            this.player1.endTurn();
        });

        it('should not make a token if no creature in discard pile', function () {
            this.player1.moveCard(this.seabringerKekoa, 'deck');
            this.player2.moveCard(this.helperBot, 'deck');
            this.player2.moveCard(this.archimedes, 'deck');
            this.player1.reap(this.yanthiGhostfin);
            this.player1.endTurn();
        });
    });
});
