describe('Mack the Knife', function () {
    describe("Mack the Knife's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['twin-bolt-emission'],
                    inPlay: ['mack-the-knife']
                },
                player2: {
                    inPlay: ['dextre', 'nexus']
                }
            });
        });

        it('should be usable even when the player named a non-shadow house', function () {
            this.player1.reap(this.mackTheKnife);
            expect(this.player1.amber).toBe(1);
            expect(this.mackTheKnife.exhausted).toBe(true);
        });

        it('should deal 1 damage when used', function () {
            this.player1.clickCard(this.mackTheKnife);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Mack the Knife');
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.nexus);
            expect(this.player1).toBeAbleToSelect(this.mackTheKnife);
            this.player1.clickCard(this.dextre);
            expect(this.dextre.tokens.damage).toBe(1);
        });

        it('should deal 1 damage and gain an amber when this kills the creature', function () {
            this.player1.play(this.twinBoltEmission);
            this.player1.clickCard(this.dextre);
            this.player1.clickCard(this.nexus);
            this.player1.clickPrompt('Done');
            expect(this.player1.amber).toBe(1);
            this.player1.clickCard(this.mackTheKnife);
            this.player1.clickPrompt("Use this card's Action ability");
            this.player1.clickCard(this.dextre);
            expect(this.dextre.location).toBe('deck');
            expect(this.player1.amber).toBe(2);
        });
    });
});
