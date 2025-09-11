describe('Poltergeistoids', function () {
    describe("Poltergeistoids's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['poltergeistoids'],
                    inPlay: ['dust-pixie'],
                    discard: ['ritual-of-balance', 'charette', 'full-moon']
                },
                player2: {
                    amber: 4,
                    hand: ['wipe-clear'],
                    discard: ['crushing-deep', 'hunting-witch']
                }
            });
            this.player1.moveCard(this.charette, 'purged');
            this.player1.moveCard(this.fullMoon, 'purged');
            this.player2.moveCard(this.huntingWitch, 'purged');
        });

        it('purges a card from a discard pile on play', function () {
            this.player1.play(this.poltergeistoids);
            expect(this.player1).toBeAbleToSelect(this.ritualOfBalance);
            expect(this.player1).toBeAbleToSelect(this.crushingDeep);
            expect(this.player1).not.toBeAbleToSelect(this.charette);
            expect(this.player1).not.toBeAbleToSelect(this.fullMoon);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.crushingDeep);
            expect(this.crushingDeep.location).toBe('purged');
        });

        it('plays a purged creature on play', function () {
            this.player1.play(this.poltergeistoids);
            this.player1.clickCard(this.crushingDeep);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).not.toBeAbleToSelect(this.fullMoon);
            expect(this.player1).not.toBeAbleToSelect(this.ritualOfBalance);
            this.player1.clickCard(this.charette);
            this.player1.clickPrompt('Right');
            expect(this.charette.location).toBe('play area');
            expect(this.charette.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('attaches to played creature and makes it geistoid', function () {
            this.player1.play(this.poltergeistoids);
            this.player1.clickCard(this.crushingDeep);
            this.player1.clickCard(this.charette);
            this.player1.clickPrompt('Right');
            expect(this.poltergeistoids.location).toBe('play area');
            expect(this.charette.upgrades).toContain(this.poltergeistoids);
            expect(this.poltergeistoids.parent).toBe(this.charette);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('geistoid');
            this.player1.reap(this.charette);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('plays a purged artifact on play', function () {
            this.player1.play(this.poltergeistoids);
            this.player1.clickCard(this.ritualOfBalance);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).not.toBeAbleToSelect(this.fullMoon);
            expect(this.player1).toBeAbleToSelect(this.ritualOfBalance);
            this.player1.clickCard(this.ritualOfBalance);
            expect(this.ritualOfBalance.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('attaches to played artifact and makes it geistoid', function () {
            this.player1.play(this.poltergeistoids);
            this.player1.clickCard(this.ritualOfBalance);
            this.player1.clickCard(this.ritualOfBalance);
            expect(this.poltergeistoids.location).toBe('play area');
            expect(this.ritualOfBalance.upgrades).toContain(this.poltergeistoids);
            expect(this.poltergeistoids.parent).toBe(this.ritualOfBalance);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.amber = 6;
            this.player2.endTurn();
            this.player1.clickPrompt('geistoid');
            this.player1.useAction(this.ritualOfBalance);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('card stays in play when upgrade is gone, but no longer geistoid', function () {
            this.player1.play(this.poltergeistoids);
            this.player1.clickCard(this.crushingDeep);
            this.player1.clickCard(this.charette);
            this.player1.clickPrompt('Right');
            expect(this.poltergeistoids.type).toBe('upgrade');
            this.player1.endTurn();
            this.player2.clickPrompt('saurian');
            this.player2.play(this.wipeClear);
            expect(this.poltergeistoids.location).toBe('discard');
            expect(this.poltergeistoids.type).toBe('action');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.reap(this.charette);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
