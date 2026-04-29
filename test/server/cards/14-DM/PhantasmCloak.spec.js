describe('Phantasm Cloak', function () {
    describe("Phantasm Cloak's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['phantasm-cloak'],
                    inPlay: ['echofly']
                },
                player2: {}
            });
        });

        it('does not gain bonus amber on reap when not haunted', function () {
            this.player1.playUpgrade(this.phantasmCloak, this.echofly);
            const startAmber = this.player1.amber;
            this.player1.reap(this.echofly);
            expect(this.player1.amber).toBe(startAmber + 1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('gains 2 bonus amber on reap when haunted', function () {
            for (let i = 0; i < 10; i++) {
                this.player1.moveCard(this.player1.player.deck[0], 'discard');
            }
            this.player1.playUpgrade(this.phantasmCloak, this.echofly);
            const startAmber = this.player1.amber;
            this.player1.reap(this.echofly);
            expect(this.player1.amber).toBe(startAmber + 1 + 2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
