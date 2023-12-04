describe('Deipno Spymaster', function () {
    describe("Deipno Spymaster's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    inPlay: ['deipno-spymaster', 'sequis', 'dominator-bauble']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should allow the player to use Spymaster on a shadow turn', function () {
            this.player1.clickPrompt('shadows');
            this.player1.clickCard(this.deipnoSpymaster);
            expect(this.player1).toHavePromptButton('Fight with this creature');
            expect(this.player1).toHavePromptButton('Reap with this creature');
            expect(this.player1).toHavePromptButton("Use this card's Omni ability");
            this.player1.clickPrompt("Use this card's Omni ability");
            expect(this.deipnoSpymaster.exhausted).toBe(true);
            expect(this.player1).toBeAbleToSelect(this.deipnoSpymaster);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.sequis);
            this.player1.clickCard(this.sequis);
            expect(this.player1).toHavePromptButton('Fight with this creature');
            expect(this.player1).toHavePromptButton('Reap with this creature');
        });

        it('should allow the player to use the Omni ability on a non-shadow turn', function () {
            this.player1.clickPrompt('dis');
            this.player1.clickCard(this.deipnoSpymaster);
            expect(this.player1).not.toHavePromptButton('Fight with this creature');
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            expect(this.player1).toHavePromptButton("Use this card's Omni ability");
            this.player1.clickPrompt("Use this card's Omni ability");
            expect(this.deipnoSpymaster.exhausted).toBe(true);
            expect(this.player1).toBeAbleToSelect(this.deipnoSpymaster);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.sequis);
            this.player1.clickCard(this.sequis);
            expect(this.player1).toHavePromptButton('Fight with this creature');
            expect(this.player1).toHavePromptButton('Reap with this creature');
        });
    });
});
