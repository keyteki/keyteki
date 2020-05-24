describe('Dino-Thief', function () {
    integration(function () {
        describe("Dino-Thief's ability", function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        house: 'shadows',
                        hand: ['dino-thief', 'eyegor', 'titan-mechanic', 'archimedes'],
                        amber: 4
                    },
                    player2: {
                        amber: 1,
                        inPlay: ['lamindra', 'shooler', 'troll']
                    }
                });
            });

            it('should choose to not exalt after play', function () {
                this.player1.play(this.dinoThief);
                this.player1.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });

            it('should choose to exalt after play', function () {
                this.player1.play(this.dinoThief);
                this.player1.clickCard(this.dinoThief);
                expect(this.player1).toBeAbleToSelect(this.dinoThief);
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.shooler);
                expect(this.player1).toBeAbleToSelect(this.lamindra);
                this.player1.clickCard(this.shooler);
                expect(this.dinoThief.amber).toBe(1);
                expect(this.shooler.tokens.damage).toBe(3);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });
    });
});
