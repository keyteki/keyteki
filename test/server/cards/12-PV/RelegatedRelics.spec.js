describe('Relegated Relics', function () {
    describe("Relegated Relics's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['relegated-relics'],
                    inPlay: ['whispering-reliquary', 'library-of-polliasaurus', 'raiding-knight'],
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ]
                },
                player2: {
                    inPlay: ['primal-relic', 'krump']
                }
            });
        });

        it('should shuffle all artifacts into their owners decks when played', function () {
            let shuffled = [];
            this.player1.player.game.on('onDeckShuffled', (event) => shuffled.push(event.player));

            this.player1.play(this.relegatedRelics);

            expect(this.whisperingReliquary.location).toBe('deck');
            expect(this.libraryOfPolliasaurus.location).toBe('deck');
            expect(this.raidingKnight.location).toBe('play area');
            expect(this.primalRelic.location).toBe('deck');
            expect(this.krump.location).toBe('play area');
            expect(shuffled).toContain(this.player1.player);
            expect(shuffled).toContain(this.player2.player);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should purge all artifacts when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.relegatedRelics);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);

            expect(this.whisperingReliquary.location).toBe('purged');
            expect(this.libraryOfPolliasaurus.location).toBe('purged');
            expect(this.raidingKnight.location).toBe('play area');
            expect(this.primalRelic.location).toBe('purged');
            expect(this.krump.location).toBe('play area');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
