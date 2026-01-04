describe('Event Horizon', function () {
    describe("Event Horizon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    hand: ['event-horizon'],
                    discard: [
                        'dust-pixie',
                        'flaxia',
                        'cpo-zytar',
                        'wild-wormhole',
                        'hunting-witch',
                        'stealth-mode'
                    ]
                }
            });
        });

        it('should play the next action card in the deck', function () {
            this.player1.moveCard(this.stealthMode, 'deck');
            this.player1.moveCard(this.huntingWitch, 'deck');
            this.player1.moveCard(this.wildWormhole, 'deck');
            this.player1.moveCard(this.cpoZytar, 'deck');
            this.player1.moveCard(this.flaxia, 'deck');
            this.player1.moveCard(this.dustPixie, 'deck');

            this.player1.play(this.eventHorizon);
            expect(this.player1).isReadyToTakeAction();
            expect(this.huntingWitch.location).toBe('play area');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.flaxia.location).toBe('discard');
            expect(this.cpoZytar.location).toBe('discard');
            expect(this.wildWormhole.location).toBe('discard');
            expect(this.stealthMode.location).toBe('deck');
            expect(this.player1.amber).toBe(3);
        });

        it('should just discard with no actions in the deck', function () {
            this.player1.moveCard(this.huntingWitch, 'deck');
            this.player1.moveCard(this.cpoZytar, 'deck');
            this.player1.moveCard(this.flaxia, 'deck');
            this.player1.moveCard(this.dustPixie, 'deck');

            this.player1.play(this.eventHorizon);
            expect(this.player1).isReadyToTakeAction();
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.flaxia.location).toBe('discard');
            expect(this.cpoZytar.location).toBe('discard');
            expect(this.player1.player.deck.length).toBe(0);
            expect(this.player1.amber).toBe(2);
        });

        it('should do nothing with no cards in the deck', function () {
            this.player1.player.deck = [];
            this.player1.play(this.eventHorizon);
            expect(this.player1).isReadyToTakeAction();
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.flaxia.location).toBe('discard');
            expect(this.cpoZytar.location).toBe('discard');
            expect(this.player1.player.deck.length).toBe(0);
            expect(this.player1.amber).toBe(2);
        });
    });
});
