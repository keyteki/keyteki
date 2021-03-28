describe('Fetchdrones', function () {
    describe("Fetchdrones's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    hand: [
                        'gub',
                        'krump',
                        'batdrone',
                        'dextre',
                        'foggify',
                        'anger',
                        'phoenix-heart',
                        'archimedes',
                        'brammo',
                        'bumpsy'
                    ],
                    inPlay: ['fetchdrones']
                },
                player2: {
                    amber: 10,
                    inPlay: ['tunk']
                }
            });
        });

        it('should not prompt for capture when no friendly creatures in play', function () {
            this.player1.moveCard(this.anger, 'deck');
            this.player1.moveCard(this.foggify, 'deck');
            this.player1.moveCard(this.batdrone, 'deck');

            this.player1.useAction(this.fetchdrones);

            expect(this.foggify.location).toBe('discard');
            expect(this.batdrone.location).toBe('discard');
            expect(this.anger.location).toBe('deck');

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not prompt for capture when no cards in deck', function () {
            this.player1.deck = [];

            this.player1.play(this.archimedes);
            this.player1.play(this.dextre);
            this.player1.useAction(this.fetchdrones);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not prompt for capture if cards are not logos', function () {
            this.player1.moveCard(this.brammo, 'deck');
            this.player1.moveCard(this.gub, 'deck');

            this.player1.play(this.archimedes);
            this.player1.play(this.dextre);

            this.player1.useAction(this.fetchdrones);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prompt for a single creature if just one card is logos', function () {
            this.player1.moveCard(this.brammo, 'deck');
            this.player1.moveCard(this.foggify, 'deck');

            this.player1.play(this.archimedes);
            this.player1.play(this.batdrone);

            this.player1.useAction(this.fetchdrones);

            expect(this.player1).toBeAbleToSelect(this.archimedes);
            expect(this.player1).toBeAbleToSelect(this.batdrone);

            this.player1.clickCard(this.batdrone);

            expect(this.batdrone.amber).toBe(2);
            expect(this.player2.amber).toBe(8);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prompt for two creature if two card are logos', function () {
            this.player1.moveCard(this.dextre, 'deck');
            this.player1.moveCard(this.foggify, 'deck');

            this.player1.play(this.archimedes);
            this.player1.play(this.batdrone);

            this.player1.useAction(this.fetchdrones);

            expect(this.player1).toBeAbleToSelect(this.archimedes);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.batdrone);

            expect(this.player1).toBeAbleToSelect(this.archimedes);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.archimedes);

            expect(this.batdrone.amber).toBe(2);
            expect(this.archimedes.amber).toBe(2);
            expect(this.player2.amber).toBe(6);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow selecting the same creature if two card are logos', function () {
            this.player1.moveCard(this.dextre, 'deck');
            this.player1.moveCard(this.foggify, 'deck');

            this.player1.play(this.archimedes);
            this.player1.play(this.batdrone);

            this.player1.useAction(this.fetchdrones);

            expect(this.player1).toBeAbleToSelect(this.archimedes);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.batdrone);

            expect(this.player1).toBeAbleToSelect(this.archimedes);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.batdrone);

            expect(this.batdrone.amber).toBe(4);
            expect(this.player2.amber).toBe(6);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prompt for a single creature when only one logos in deck', function () {
            this.player1.deck = [];
            this.player1.moveCard(this.dextre, 'deck');

            this.player1.play(this.archimedes);
            this.player1.play(this.batdrone);

            this.player1.useAction(this.fetchdrones);

            expect(this.player1).toBeAbleToSelect(this.archimedes);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.batdrone);

            expect(this.batdrone.amber).toBe(2);
            expect(this.player2.amber).toBe(8);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prompt for a single creature when opponent has 1 amber', function () {
            this.player2.amber = 1;

            this.player1.moveCard(this.dextre, 'deck');
            this.player1.moveCard(this.foggify, 'deck');

            this.player1.play(this.archimedes);
            this.player1.play(this.batdrone);

            this.player1.useAction(this.fetchdrones);

            expect(this.player1).toBeAbleToSelect(this.archimedes);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.batdrone);

            expect(this.batdrone.amber).toBe(1);
            expect(this.player2.amber).toBe(0);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prompt for a two creatures when opponent has 3 amber', function () {
            this.player2.amber = 3;

            this.player1.moveCard(this.dextre, 'deck');
            this.player1.moveCard(this.foggify, 'deck');

            this.player1.play(this.archimedes);
            this.player1.play(this.batdrone);

            this.player1.useAction(this.fetchdrones);

            expect(this.player1).toBeAbleToSelect(this.archimedes);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.archimedes);

            expect(this.batdrone.amber).toBe(2);
            expect(this.archimedes.amber).toBe(1);
            expect(this.player2.amber).toBe(0);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
