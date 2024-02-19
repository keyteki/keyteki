describe('Invigorating Shower', function () {
    describe("Invigorating Shower's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['invigorating-shower'],
                    discard: ['poke', 'dust-pixie', 'fertility-chant']
                },
                player2: {
                    discard: ['help-from-future-self']
                }
            });
        });

        it('shuffles a house back into your deck with one card', function () {
            let shuffled = null;
            this.player1.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));
            this.player1.play(this.invigoratingShower);
            this.player1.clickPrompt('logos');
            expect(shuffled).toBe(this.player1.player);
            expect(this.poke.location).toBe('deck');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.fertilityChant.location).toBe('discard');
            expect(this.invigoratingShower.location).toBe('discard');
            expect(this.helpFromFutureSelf.location).toBe('discard');
        });

        it('shuffles a house back into your deck with two cards', function () {
            let shuffled = null;
            this.player1.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));
            this.player1.play(this.invigoratingShower);
            this.player1.clickPrompt('untamed');
            expect(shuffled).toBe(this.player1.player);
            expect(this.poke.location).toBe('discard');
            expect(this.dustPixie.location).toBe('deck');
            expect(this.fertilityChant.location).toBe('deck');
            expect(this.invigoratingShower.location).toBe('discard');
            expect(this.helpFromFutureSelf.location).toBe('discard');
        });

        it('shuffles a house back into your deck with no cards', function () {
            let shuffled = null;
            this.player1.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));
            this.player1.play(this.invigoratingShower);
            this.player1.clickPrompt('ekwidon');
            expect(shuffled).toBe(this.player1.player);
            expect(this.poke.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.fertilityChant.location).toBe('discard');
            expect(this.invigoratingShower.location).toBe('discard');
            expect(this.helpFromFutureSelf.location).toBe('discard');
        });
    });
});
