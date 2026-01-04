describe('Placeholder', function () {
    describe("Placeholder's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['placeholder'],
                    inPlay: ['helper-bot', 'archimedes', 'ronnie-wristclocks']
                },
                player2: {
                    hand: ['scowly-caper'],
                    inPlay: ['lamindra', 'troll']
                }
            });
        });

        it('moves a creature and deals 2 damage to kill it', function () {
            this.player1.play(this.placeholder);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).toBeAbleToSelect(this.archimedes);
            expect(this.player1).toBeAbleToSelect(this.ronnieWristclocks);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.lamindra);
            this.player1.clickPrompt('Right');
            expect(this.lamindra.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('repeats if first effect does not kill creature', function () {
            this.player1.play(this.placeholder);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Left');
            expect(this.troll.location).toBe('play area');
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.player2.player.creaturesInPlay[0]).toBe(this.troll);

            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).toBeAbleToSelect(this.archimedes);
            expect(this.player1).toBeAbleToSelect(this.ronnieWristclocks);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Right');
            expect(this.troll.location).toBe('play area');
            expect(this.troll.tokens.damage).toBe(4);
            expect(this.player2.player.creaturesInPlay[1]).toBe(this.troll);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
