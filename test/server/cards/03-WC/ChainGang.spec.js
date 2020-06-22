describe('Chain Gang', function () {
    describe("Chain Gang's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'shadows',
                    hand: ['subtle-chain', 'virtuous-works', 'chuff-ape'],
                    inPlay: ['chain-gang', 'mindwarper', 'blypyp']
                },
                player2: {
                    amber: 5,
                    hand: ['mother']
                }
            });
        });

        it('ready itself when I play subtle chain, and prompt to shuffle subtle chain back into my deck on action use', function () {
            this.player1.reap(this.chainGang);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.chainGang.exhausted).toBe(true);
            this.player1.play(this.subtleChain);
            this.player1.clickCard(this.chainGang);
            expect(this.mother.location).toBe('discard');
            expect(this.subtleChain.location).toBe('discard');
            expect(this.chainGang.exhausted).toBe(false);
            this.player1.clickCard(this.chainGang);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toBeAbleToSelect(this.subtleChain);
            this.player1.clickCard(this.subtleChain);
            expect(this.subtleChain.location).toBe('deck');
            expect(this.player1.amber).toBe(7);
            expect(this.player2.amber).toBe(4);
        });

        it('steals even when there is no subtle chain', function () {
            this.player1.clickCard(this.chainGang);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(4);
        });
    });
});
