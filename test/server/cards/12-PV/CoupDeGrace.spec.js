describe('Coup de Grâce', function () {
    describe("Coup de Grâce's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['coup-de-grâce', 'festering-touch'],
                    inPlay: ['charette', 'xenos-bloodshadow']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump', 'dust-pixie']
                }
            });
        });

        it('should destroy all damaged creatures when played', function () {
            this.player1.play(this.festeringTouch);
            this.player1.clickCard(this.charette);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Done');
            this.player1.play(this.coupDeGrâce);
            expect(this.charette.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.xenosBloodshadow.location).toBe('play area');
            expect(this.dustPixie.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should deal 4 damage to each friendly creature when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.coupDeGrâce);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.krump.tokens.damage).toBe(4);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.coupDeGrâce.location).toBe('discard');
            expect(this.charette.location).toBe('play area');
            expect(this.xenosBloodshadow.location).toBe('play area');
            expect(this.charette.tokens.damage).toBeUndefined();
            expect(this.xenosBloodshadow.tokens.damage).toBeUndefined();
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
