describe('Miss Chievous', function () {
    describe("Miss Chievous's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['echofly', 'infiltrator'],
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
            expect(this.player1).isReadyToTakeAction();
        });

        it('discards top 2 cards for opponent when a friendly Geistoid enters play and player has no deck', function () {
            this.player1.player.deck = [];
            expect(this.missChievous.location).toBe('play area');
            this.player1.playCreature(this.echofly);
            expect(this.initiation.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('discards top 2 cards for player when a friendly Geistoid enters play and opponent has no deck', function () {
            this.player2.player.deck = [];
            this.player1.playCreature(this.echofly);
            expect(this.gub.location).toBe('discard');
            expect(this.keyToDis.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('triggers for self', function () {
            this.player1.moveCard(this.missChievous, 'hand');
            this.player1.playCreature(this.missChievous);
            expect(this.gub.location).toBe('discard');
            expect(this.keyToDis.location).toBe('discard');
            expect(this.initiation.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('treachery creatures will not trigger', function () {
            this.player1.playCreature(this.infiltrator);
            expect(this.gub.location).toBe('deck');
            expect(this.keyToDis.location).toBe('deck');
            expect(this.initiation.location).toBe('deck');
            expect(this.dustPixie.location).toBe('deck');
        });

        it('plays topmost creature from discard on reap', function () {
            this.player1.reap(this.missChievous);
            this.player1.clickPrompt('Right');
            expect(this.charette.location).toBe('play area');
            expect(this.charette.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Miss Chievous's ability with Gebuk", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['gateway-to-dis'],
                    inPlay: ['gebuk'],
                    discard: ['miss-chievous', 'flaxia', 'gub']
                },
                player2: {}
            });
        });

        it('triggers when Gebuk puts Miss Chievous into play', function () {
            this.player1.moveCard(this.gub, 'deck');
            this.player1.moveCard(this.flaxia, 'deck');
            this.player1.moveCard(this.missChievous, 'deck'); // Miss Chievous on top
            this.player1.play(this.gatewayToDis); // Destroys Gebuk
            // Gebuk destroyed: discards Miss Chievous, puts her into play after Gebuk leaves
            // Miss Chievous triggers for herself entering play, discards top 2 from each deck
            expect(this.gebuk.location).toBe('discard');
            expect(this.missChievous.location).toBe('play area');
            expect(this.flaxia.location).toBe('discard'); // discarded by Miss Chievous
            expect(this.gub.location).toBe('discard'); // discarded by Miss Chievous
        });
    });
});
