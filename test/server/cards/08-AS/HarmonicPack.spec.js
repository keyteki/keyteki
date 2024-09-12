describe('Harmonic Pack', function () {
    describe("Harmonic Pack's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['cpo-zytar'],
                    hand: ['harmonic-pack', 'scoop-up']
                },
                player2: {
                    inPlay: ['crim-torchtooth'],
                    archives: ['brikk-nastee']
                }
            });
        });

        it('should deal 2 damage, discard from enemy archives, and do 3 more damage', function () {
            this.player1.play(this.harmonicPack);
            expect(this.player1).toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).toBeAbleToSelect(this.crimTorchtooth);
            this.player1.clickCard(this.crimTorchtooth);
            expect(this.crimTorchtooth.tokens.damage).toBe(2);
            expect(this.player1).toHavePrompt("Which player's archives");
            this.player1.clickPrompt("Opponent's");
            expect(this.brikkNastee.location).toBe('discard');
            expect(this.crimTorchtooth.tokens.damage).toBe(5);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should only do 2 damage if no card was discarded from archives (also it should let you choose an archive which has no cards in it)', function () {
            this.player1.play(this.harmonicPack);
            this.player1.clickCard(this.crimTorchtooth);
            expect(this.crimTorchtooth.tokens.damage).toBe(2);
            this.player1.clickPrompt('Mine');
            expect(this.brikkNastee.location).toBe('archives');
            expect(this.crimTorchtooth.tokens.damage).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should discard from archives even if there was no creature to damage', function () {
            this.player1.play(this.scoopUp);
            this.player1.clickCard(this.cpoZytar);
            this.player1.clickCard(this.crimTorchtooth);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            this.player1.play(this.harmonicPack);
            this.player1.clickPrompt("Opponent's");
            expect(this.brikkNastee.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
