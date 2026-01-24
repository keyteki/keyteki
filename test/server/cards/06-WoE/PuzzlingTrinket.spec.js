describe('Puzzling Trinket', function () {
    describe("Puzzling Trinket's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['puzzling-trinket', 'antiquities-dealer'],
                    hand: ['pelf', 'ancient-battleground', 'vow-of-blood']
                },
                player2: {
                    inPlay: ['troll', 'flaxia'],
                    amber: 2
                }
            });

            this.ancientBattleground.enhancements = ['amber', 'amber', 'damage'];
        });

        it('should not trigger if no bonus', function () {
            this.player1.play(this.pelf);
            expect(this.player1).isReadyToTakeAction();
        });

        // Amber -> amber
        it('should ask to replace amber icon with other 3 options', function () {
            this.player1.play(this.vowOfBlood);
            expect(this.player1).toHavePrompt('How do you wish to resolve this amber icon?');
            expect(this.player1).toHavePromptButton('amber');
            expect(this.player1).toHavePromptButton('capture');
            expect(this.player1).toHavePromptButton('damage');
            expect(this.player1).toHavePromptButton('draw');
            this.player1.clickPrompt('amber');
            expect(this.player1.amber).toBe(1);
        });

        // Amber -> capture
        it('should replace amber icon with capture', function () {
            this.player1.play(this.vowOfBlood);
            this.player1.clickPrompt('capture');
            this.player1.clickCard(this.antiquitiesDealer);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(1);
            expect(this.antiquitiesDealer.amber).toBe(1);
        });

        // Amber -> draw
        it('should replace amber icon with draw', function () {
            this.player1.play(this.vowOfBlood);
            this.player1.clickPrompt('draw');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
            expect(this.player1.hand.length).toBe(3);
        });

        // Amber -> damage
        it('should replace amber icon with damage', function () {
            this.player1.play(this.vowOfBlood);
            this.player1.clickPrompt('damage');
            this.player1.clickCard(this.troll);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
            expect(this.troll.tokens.damage).toBe(3); // dmg + vow of blood
        });

        it('should not replace other icons', function () {
            this.player1.play(this.ancientBattleground);
            this.player1.clickPrompt('damage');
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('draw');
            this.player1.clickCard(this.troll);
            expect(this.player1.amber).toBe(0);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.player1.hand.length).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
