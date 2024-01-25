describe('Arcane Transmitter', function () {
    describe("Arcane Transmitter's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'unfathomable',
                    hand: ['arcane-transmitter'],
                    discard: [
                        'poke',
                        'dust-pixie',
                        'roxador',
                        'helper-bot',
                        'wikolia',
                        'crushing-deep'
                    ]
                },
                player2: {
                    inPlay: ['culf-the-quiet'],
                    discard: ['faust-the-great', 'spoils-of-battle', 'tremor']
                }
            });
            this.player1.chains = 36;
            this.player2.chains = 36;
        });

        describe('as an action', function () {
            beforeEach(function () {
                this.player1.moveCard(this.poke, 'deck');
                this.player1.moveCard(this.dustPixie, 'deck');
                this.player1.moveCard(this.roxador, 'deck');
                this.player1.moveCard(this.helperBot, 'deck');
                this.player1.moveCard(this.wikolia, 'deck');
                this.player1.moveCard(this.crushingDeep, 'deck');
                this.player2.player.deck = [];
                this.player2.moveCard(this.faustTheGreat, 'deck');
                this.player2.moveCard(this.spoilsOfBattle, 'deck');
                this.player2.moveCard(this.tremor, 'deck');

                this.player1.play(this.arcaneTransmitter);
                this.player1.endTurn();
                this.player2.clickPrompt('saurian');
                this.player2.endTurn();
                this.player1.clickPrompt('unfathomable');
            });

            it('discards top 4 from player deck', function () {
                this.player1.useAction(this.arcaneTransmitter);
                this.player1.clickPrompt('Mine');
                expect(this.player1.player.discard[0]).toBe(this.roxador);
                expect(this.crushingDeep.location).toBe('discard');
                expect(this.wikolia.location).toBe('discard');
                expect(this.helperBot.location).toBe('discard');
                expect(this.roxador.location).toBe('discard');
                expect(this.dustPixie.location).toBe('deck');
                expect(this.poke.location).toBe('deck');
                expect(this.faustTheGreat.location).toBe('deck');
                expect(this.spoilsOfBattle.location).toBe('deck');
                expect(this.tremor.location).toBe('deck');
            });

            it('discards top 4 from opponent deck', function () {
                this.player1.useAction(this.arcaneTransmitter);
                this.player1.clickPrompt("Opponent's");
                expect(this.player2.player.discard[0]).toBe(this.faustTheGreat);
                expect(this.crushingDeep.location).toBe('deck');
                expect(this.wikolia.location).toBe('deck');
                expect(this.helperBot.location).toBe('deck');
                expect(this.roxador.location).toBe('deck');
                expect(this.dustPixie.location).toBe('deck');
                expect(this.poke.location).toBe('deck');
                expect(this.faustTheGreat.location).toBe('discard');
                expect(this.spoilsOfBattle.location).toBe('discard');
                expect(this.tremor.location).toBe('discard');
            });
        });

        it('can shuffle your discard pile into your deck on scrap', function () {
            let shuffled = null;
            this.player1.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));
            this.player1.scrap(this.arcaneTransmitter);
            expect(this.player1.player.discard.length).toBe(0);
            expect(shuffled).toBe(this.player1.player);
            expect(this.crushingDeep.location).toBe('deck');
            expect(this.wikolia.location).toBe('deck');
            expect(this.helperBot.location).toBe('deck');
            expect(this.roxador.location).toBe('deck');
            expect(this.dustPixie.location).toBe('deck');
            expect(this.poke.location).toBe('deck');
            expect(this.arcaneTransmitter.location).toBe('deck');
            expect(this.faustTheGreat.location).toBe('discard');
            expect(this.spoilsOfBattle.location).toBe('discard');
            expect(this.tremor.location).toBe('discard');
        });
    });
});
