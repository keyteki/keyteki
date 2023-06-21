describe('Stratosmack', function () {
    describe("Stratosmack' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    token: 'warrior',
                    inPlay: ['pelf'],
                    hand: ['stratosmack']
                },
                player2: {
                    inPlay: ['batdrone', 'troll']
                }
            });
        });

        it('should make a token when killing an enemy creature', function () {
            this.player1.play(this.stratosmack);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.batdrone);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should make a token when not killing a creature', function () {
            this.player1.play(this.stratosmack);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should make a token when killing a friendly creature', function () {
            this.player1.play(this.stratosmack);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.pelf);
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should make a token when not killing a warded creature', function () {
            this.batdrone.tokens.ward = 1;
            this.player1.play(this.stratosmack);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.batdrone);
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
