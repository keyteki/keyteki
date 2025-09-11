describe('Jervi', function () {
    describe("Jervi's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['jervi', 'fertility-chant'],
                    discard: ['dust-pixie', 'hunting-witch']
                },
                player2: {
                    hand: ['mind-barb'],
                    discard: ['poke']
                }
            });
            this.player1.chains = 36;
            this.player1.moveCard(this.huntingWitch, 'deck');
        });

        it('can search deck for a card on reap', function () {
            this.player1.playCreature(this.jervi);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            let shuffled = null;
            this.player1.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));
            this.player1.reap(this.jervi);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.poke);
            this.player1.clickCard(this.huntingWitch);
            this.player1.clickPrompt('Done');
            expect(this.huntingWitch.location).toBe('hand');
            expect(shuffled).toBe(this.player1.player);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('can archive a card from discard on scrap', function () {
            this.player1.play(this.fertilityChant);
            this.player1.scrap(this.jervi);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.fertilityChant);
            expect(this.player1).toBeAbleToSelect(this.jervi);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.poke);
            this.player1.clickCard(this.dustPixie);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.dustPixie.location).toBe('archives');
            expect(this.player1.player.archives).toContain(this.dustPixie);
        });

        it('can archive itself on scrap', function () {
            this.player1.scrap(this.jervi);
            this.player1.clickCard(this.jervi);
            expect(this.jervi.location).toBe('archives');
            expect(this.player1.player.archives).toContain(this.jervi);
        });
    });
});
