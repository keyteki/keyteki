describe('Warfaline', function () {
    describe("Warfaline's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    hand: ['warfaline', 'flaxia'],
                    discard: ['poke', 'dust-pixie', 'roxador', 'helper-bot', 'urchin', 'umbra']
                },
                player2: {
                    inPlay: ['culf-the-quiet'],
                    discard: ['faust-the-great', 'spoils-of-battle', 'tremor']
                }
            });
            this.player1.chains = 36;
        });

        it('shuffles top 5 of discard in for player on play ', function () {
            let shuffled = null;
            this.player1.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));
            let deckLen = this.player1.player.deck.length;
            this.player1.play(this.warfaline);
            this.player1.clickPrompt('Mine');
            expect(this.player1.player.deck.length).toBe(deckLen + 5);
            expect(this.player1.player.discard.length).toBe(1);
            expect(this.player2.player.discard.length).toBe(3);
            expect(this.poke.location).toBe('deck');
            expect(this.dustPixie.location).toBe('deck');
            expect(this.roxador.location).toBe('deck');
            expect(this.helperBot.location).toBe('deck');
            expect(this.urchin.location).toBe('deck');
            expect(this.umbra.location).toBe('discard');
            expect(shuffled).toBe(this.player1.player);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('shuffles top 5 of discard in for opponent on play ', function () {
            let shuffled = null;
            this.player1.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));
            let deckLen = this.player2.player.deck.length;
            this.player1.play(this.warfaline);
            this.player1.clickPrompt("Opponent's");
            expect(this.player2.player.deck.length).toBe(deckLen + 3);
            expect(this.player2.player.discard.length).toBe(0);
            expect(this.player1.player.discard.length).toBe(6);
            expect(this.faustTheGreat.location).toBe('deck');
            expect(this.spoilsOfBattle.location).toBe('deck');
            expect(this.tremor.location).toBe('deck');
            expect(shuffled).toBe(this.player2.player);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('shuffles top 5 of discard in for player on fight ', function () {
            this.player1.play(this.warfaline);
            this.player1.clickPrompt("Opponent's");
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            let shuffled = null;
            this.player1.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));
            let deckLen = this.player1.player.deck.length;
            this.player1.fightWith(this.warfaline, this.culfTheQuiet);
            this.player1.clickPrompt('Mine');
            expect(this.player1.player.deck.length).toBe(deckLen + 5);
            expect(this.player1.player.discard.length).toBe(1);
            expect(this.poke.location).toBe('deck');
            expect(this.dustPixie.location).toBe('deck');
            expect(this.roxador.location).toBe('deck');
            expect(this.helperBot.location).toBe('deck');
            expect(this.urchin.location).toBe('deck');
            expect(this.umbra.location).toBe('discard');
            expect(shuffled).toBe(this.player1.player);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('shuffles nothing for empty discard ', function () {
            let shuffled = null;
            this.player1.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));
            this.player1.player.discard = [];
            this.player1.play(this.warfaline);
            this.player1.clickPrompt('Mine');
            expect(shuffled).toBe(this.player1.player);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
