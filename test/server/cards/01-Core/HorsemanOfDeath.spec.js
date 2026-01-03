describe('Horseman of Death', function () {
    describe("Horseman of Death's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['horseman-of-death'],
                    discard: [
                        'horseman-of-famine',
                        'horseman-of-pestilence',
                        'horseman-of-war',
                        'troll'
                    ]
                },
                player2: {}
            });
        });

        it('should return each Horseman creature from discard to hand', function () {
            this.player1.moveCard(this.horsemanOfWar, 'deck');
            this.player1.play(this.horsemanOfDeath);
            expect(this.horsemanOfFamine.location).toBe('hand');
            expect(this.horsemanOfPestilence.location).toBe('hand');
            expect(this.horsemanOfWar.location).toBe('deck');
            expect(this.troll.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("Horseman of Death's ability with no Horsemen in discard", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['horseman-of-death'],
                    discard: ['troll']
                },
                player2: {}
            });
        });

        it('should not return non-Horseman creatures', function () {
            this.player1.play(this.horsemanOfDeath);
            expect(this.troll.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
