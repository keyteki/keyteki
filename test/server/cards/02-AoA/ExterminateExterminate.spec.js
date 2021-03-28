describe('Exterminate!Exterminate!', function () {
    describe("Exterminate!Exterminate!'s ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['exterminate-exterminate'],
                    inPlay: ['the-terror', 'blypyp', 'zorg', 'yxilx-dominator']
                },
                player2: {
                    inPlay: ['commander-remiel', 'troll', 'sequis', 'yxilo-bolter']
                }
            });
        });

        it('should prompt the player and destroy creatures correctly', function () {
            this.player1.play(this.exterminateExterminate);
            expect(this.player1).toHavePrompt('Exterminate! Exterminate!');
            expect(this.player1).toBeAbleToSelect(this.commanderRemiel);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.yxiloBolter);
            this.player1.clickCard(this.sequis);
            expect(this.sequis.location).toBe('discard');
            expect(this.player1).toHavePrompt('Exterminate! Exterminate!');
            expect(this.player1).toBeAbleToSelect(this.commanderRemiel);
            expect(this.player1).not.toBeAbleToSelect(this.sequis);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.yxiloBolter);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
