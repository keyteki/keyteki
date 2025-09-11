describe('A Ghost in the Sun', function () {
    describe("A Ghost in the Sun's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['a-ghost-in-the-sun'],
                    discard: ['gub', 'echofly', 'charette']
                },
                player2: {
                    amber: 3,
                    discard: ['hunting-witch']
                }
            });
        });

        it('should do nothing if no keys are forged', function () {
            this.player1.play(this.aGhostInTheSun);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should do nothing if no creatures in discard', function () {
            this.player1.player.discard = [];
            this.player2.player.keys = { red: true, blue: false, yellow: false };
            this.player1.play(this.aGhostInTheSun);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should put one creature into play if opponent has one forged key', function () {
            this.player2.player.keys = { red: true, blue: false, yellow: false };
            this.player1.play(this.aGhostInTheSun);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.echofly);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            this.player1.clickCard(this.charette);
            expect(this.charette.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay).toContain(this.charette);
            expect(this.charette.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should put two creatures into play if opponent has two forged keys', function () {
            this.player2.player.keys = { red: true, blue: false, yellow: true };
            this.player1.play(this.aGhostInTheSun);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.echofly);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            this.player1.clickCard(this.charette);
            this.player1.clickCard(this.echofly);
            this.player1.clickPrompt('Right');
            expect(this.charette.location).toBe('play area');
            expect(this.echofly.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay).toContain(this.charette);
            expect(this.player1.player.creaturesInPlay).toContain(this.echofly);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
