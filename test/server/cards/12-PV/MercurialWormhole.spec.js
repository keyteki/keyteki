describe('Mercurial Wormhole', function () {
    describe("Mercurial Wormhole's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    hand: ['mercurial-wormhole'],
                    discard: ['ancient-bear', 'krump'],
                    inPlay: ['dust-pixie', 'dextre']
                },
                player2: {
                    inPlay: ['quixxle-stone', 'medic-ingram', 'cxo-taber']
                }
            });

            this.player1.moveCard(this.ancientBear, 'deck');
        });

        it('should play the top card and change active house', function () {
            this.player1.play(this.mercurialWormhole);
            this.player1.clickPrompt('Right');
            expect(this.ancientBear.location).toBe('play area');
            this.player1.reap(this.dustPixie);
            expect(this.player1.amber).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not change active house if no card is played', function () {
            this.player1.player.deck = [];
            this.player1.play(this.mercurialWormhole);
            this.player1.reap(this.dextre);
            expect(this.player1.amber).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not change active house if the card cannot be played', function () {
            this.player2.moveCard(this.medicIngram, 'discard');
            this.player2.moveCard(this.cxoTaber, 'discard');
            this.player1.play(this.mercurialWormhole);
            expect(this.ancientBear.location).toBe('deck');
            this.player1.reap(this.dextre);
            expect(this.player1.amber).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
