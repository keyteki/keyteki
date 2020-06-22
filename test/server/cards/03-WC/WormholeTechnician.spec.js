describe('Wormhole Technician', function () {
    describe("Wormhole Technician's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['wormhole-technician'],
                    discard: ['virtuous-works', 'hexpion']
                },
                player2: {
                    inPlay: []
                }
            });
            this.player1.moveCard(this.hexpion, 'deck');
            this.player1.moveCard(this.virtuousWorks, 'deck');
        });
        it('should archive the card if is not of house Logos', function () {
            this.player1.reap(this.wormholeTechnician);
            expect(this.virtuousWorks.location).toBe('archives');
            expect(this.hexpion.location).toBe('deck');
        });
        it('should play the card if it is of house Logos', function () {
            this.player1.moveCard(this.virtuousWorks, 'discard');
            this.player1.reap(this.wormholeTechnician);
            expect(this.player1).toHavePrompt('Which flank do you want to place this creature on?');
            this.player1.clickPrompt('Left');
            expect(this.virtuousWorks.location).toBe('discard');
            expect(this.hexpion.location).toBe('play area');
        });
    });
});
