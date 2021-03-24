describe('Wikolia Evil Twin', function () {
    describe("Wikolia Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    inPlay: ['wikolia-evil-twin']
                },
                player2: {
                    amber: 9,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('exalt and raise keycost for opponent', function () {
            this.player1.reap(this.wikoliaEvilTwin);
            this.player1.endTurn();
            expect(this.wikoliaEvilTwin.amber).toBe(1);
            expect(this.player2).not.toHavePrompt('Forge a Key');
            expect(this.player2.player.getForgedKeys()).toBe(0);
            expect(this.player2.player.amber).toBe(9);
        });
    });
});
