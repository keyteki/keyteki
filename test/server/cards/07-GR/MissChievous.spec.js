describe('Miss Chievous', function () {
    describe("Miss Chievous's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['echofly'],
                    inPlay: ['miss-chievous'],
                    discard: [
                        'ritual-of-balance',
                        'full-moon',
                        'charette',
                        'flaxia',
                        'gub',
                        'key-to-dis'
                    ]
                },
                player2: {
                    amber: 4,
                    discard: ['crushing-deep', 'initiation', 'dust-pixie']
                }
            });
            this.player1.moveCard(this.keyToDis, 'deck');
            this.player1.moveCard(this.gub, 'deck');
            this.player2.moveCard(this.dustPixie, 'deck');
            this.player2.moveCard(this.initiation, 'deck');
        });

        it('discards top 2 cards for each player when a friendly Geistoid enters play', function () {
            this.player1.playCreature(this.echofly);
            expect(this.gub.location).toBe('discard');
            expect(this.keyToDis.location).toBe('discard');
            expect(this.initiation.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('discards top 2 cards for opponent when a friendly Geistoid enters play and player has no deck', function () {
            this.player1.player.deck = [];
            console.log(
                'Player 2 deck length before play:',
                this.player1.deck.length,
                this.player2.player.deck.length
            );
            this.player1.playCreature(this.echofly);
            expect(this.initiation.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('discards top 2 cards for player when a friendly Geistoid enters play and opponent has no deck', function () {
            this.player2.player.deck = [];
            console.log(
                'Player 2 deck length before play:',
                this.player1.deck.length,
                this.player2.player.deck.length
            );
            this.player1.playCreature(this.echofly);
            expect(this.gub.location).toBe('discard');
            expect(this.keyToDis.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('triggers for self', function () {
            this.player1.moveCard(this.missChievous, 'hand');
            this.player1.playCreature(this.missChievous);
            expect(this.gub.location).toBe('discard');
            expect(this.keyToDis.location).toBe('discard');
            expect(this.initiation.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('plays topmost creature from discard on reap', function () {
            this.player1.reap(this.missChievous);
            this.player1.clickPrompt('Right');
            expect(this.charette.location).toBe('play area');
            expect(this.charette.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
