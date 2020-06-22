describe('Orb of Wonder', function () {
    describe("Orb of Wonder's omni ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 2,
                    inPlay: ['orb-of-wonder'],
                    hand: ['grenade-snib', 'lamindra', 'murkens', 'troll', 'krump', 'redlock']
                },
                player2: {
                    amber: 0,
                    hand: ['bulwark', 'gub', 'shooler']
                }
            });
            this.player1.moveCard(this.murkens, 'deck');
            this.player1.moveCard(this.troll, 'deck');
            this.player1.moveCard(this.krump, 'deck');
            this.player1.moveCard(this.redlock, 'deck');
        });

        it('should sacrifice the artifact and select a card from deck', function () {
            this.player1.useAction(this.orbOfWonder, true);
            expect(this.orbOfWonder.location).toBe('discard');
            expect(this.player1).toHavePrompt('Orb of Wonder');
            expect(this.player1).toBeAbleToSelect(this.murkens);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.redlock);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.grenadeSnib);
            expect(this.player1).not.toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.shooler);

            this.player1.clickCard(this.murkens);
            this.player1.clickPrompt('Done');
            expect(this.murkens.location).toBe('hand');
        });
    });
});
