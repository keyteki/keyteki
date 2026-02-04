describe('Exterminate!Exterminate!', function () {
    describe("Exterminate!Exterminate!'s ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['exterminate-exterminate'],
                    inPlay: ['blypyp', 'zorg', 'yxilx-dominator']
                },
                player2: {
                    inPlay: ['commander-remiel', 'troll', 'sequis']
                }
            });
        });

        it('should let the player choose which Mars creature to use', function () {
            this.player1.play(this.exterminateExterminate);
            // First, select which Mars creature to use
            expect(this.player1).toHavePrompt('Choose a friendly Mars creature');
            expect(this.player1).toBeAbleToSelect(this.blypyp);
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.yxilxDominator);
            // Select zorg (power 7) first
            this.player1.clickCard(this.zorg);

            // Now select a creature with power < 7 to destroy
            expect(this.player1).toHavePrompt(
                'Choose a non-Mars creature with less than 7 power to destroy'
            );
            expect(this.player1).toBeAbleToSelect(this.commanderRemiel); // power 3
            expect(this.player1).toBeAbleToSelect(this.sequis); // power 4
            expect(this.player1).not.toBeAbleToSelect(this.troll); // power 8
            this.player1.clickCard(this.sequis);

            // Select next Mars creature - zorg is no longer available
            expect(this.player1).toHavePrompt('Choose a friendly Mars creature');
            expect(this.player1).toBeAbleToSelect(this.blypyp);
            expect(this.player1).not.toBeAbleToSelect(this.zorg); // already used
            expect(this.player1).toBeAbleToSelect(this.yxilxDominator);
            // Select yxilx-dominator (power 9)
            this.player1.clickCard(this.yxilxDominator);

            // Now select a creature with power < 9 to destroy
            expect(this.player1).toHavePrompt(
                'Choose a non-Mars creature with less than 9 power to destroy'
            );
            expect(this.player1).toBeAbleToSelect(this.commanderRemiel); // power 3
            expect(this.player1).not.toBeAbleToSelect(this.sequis); // already marked
            expect(this.player1).toBeAbleToSelect(this.troll); // power 8 < 9
            this.player1.clickCard(this.troll);

            // Select last Mars creature - only blypyp remains
            expect(this.player1).toHavePrompt('Choose a friendly Mars creature');
            expect(this.player1).toBeAbleToSelect(this.blypyp);
            expect(this.player1).not.toBeAbleToSelect(this.zorg);
            expect(this.player1).not.toBeAbleToSelect(this.yxilxDominator);
            this.player1.clickCard(this.blypyp);

            // blypyp has power 2, so only creatures with power < 2 would be valid
            // commander-remiel has power 3, so no valid targets - skip to end
            // All creatures are destroyed simultaneously at the end
            expect(this.sequis.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.commanderRemiel.location).toBe('play area'); // not destroyed
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not allow selecting the same target twice', function () {
            this.player1.play(this.exterminateExterminate);
            // Select yxilx-dominator (power 9)
            this.player1.clickCard(this.yxilxDominator);
            // Select troll (power 8)
            this.player1.clickCard(this.troll);

            // Select zorg (power 7)
            this.player1.clickCard(this.zorg);
            // Troll is already marked, so can't be selected again
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.commanderRemiel);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            this.player1.clickCard(this.sequis);

            // Select blypyp (power 2)
            this.player1.clickCard(this.blypyp);
            // No valid targets - complete

            expect(this.troll.location).toBe('discard');
            expect(this.sequis.location).toBe('discard');
            expect(this.commanderRemiel.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
