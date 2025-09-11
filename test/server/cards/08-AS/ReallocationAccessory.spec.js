describe('Reallocation Accessory', function () {
    describe("Reallocation Accessory's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['reallocation-accessory', 'gub', 'charette'],
                    inPlay: ['helper-bot'],
                    archives: ['mark-of-dis']
                },
                player2: {
                    inPlay: ['troll', 'hunting-witch'],
                    archives: ['key-abduction', 'mars-first', 'blypyp']
                }
            });
        });

        it('should archive a card and deal damage based on my archives', function () {
            this.player1.playUpgrade(this.reallocationAccessory, this.helperBot);
            this.player1.reap(this.helperBot);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).not.toBeAbleToSelect(this.helperBot);
            this.player1.clickCard(this.charette);
            expect(this.charette.location).toBe('archives');
            this.player1.clickPrompt('Mine');
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.huntingWitch);
            expect(this.troll.tokens.damage).toBe(1);
            expect(this.huntingWitch.tokens.damage).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should archive a card and deal damage based on opponent archives', function () {
            this.player1.playUpgrade(this.reallocationAccessory, this.helperBot);
            this.player1.reap(this.helperBot);
            this.player1.clickCard(this.charette);
            this.player1.clickPrompt("Opponent's");
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.huntingWitch);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.huntingWitch.tokens.damage).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
