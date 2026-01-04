describe('Rm-Foler', function () {
    describe("Rm-Foler's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['rm-foler', 'helper-bot']
                },
                player2: {
                    inPlay: ['ganger-chieftain', 'krump']
                }
            });
        });

        it('destroys an enemy creature on reap and draw a card', function () {
            let handLen = this.player1.player.hand.length;
            this.player1.reap(this.rmFoler);
            expect(this.player1).toBeAbleToSelect(this.gangerChieftain);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.rmFoler);
            expect(this.player1).not.toBeAbleToSelect(this.helperBot);
            this.player1.clickCard(this.krump);
            expect(this.krump.location).toBe('discard');
            expect(this.rmFoler.location).toBe('play area');
            expect(this.player1.player.hand.length).toBe(handLen + 1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not draw if nothing is destroyed', function () {
            this.krump.ward();
            let handLen = this.player1.player.hand.length;
            this.player1.reap(this.rmFoler);
            this.player1.clickCard(this.krump);
            expect(this.krump.location).toBe('play area');
            expect(this.krump.tokens.ward).toBe(undefined);
            expect(this.rmFoler.location).toBe('play area');
            expect(this.player1.player.hand.length).toBe(handLen);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
