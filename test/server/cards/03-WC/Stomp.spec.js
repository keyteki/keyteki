describe('Stomp', function () {
    describe("Stomp's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['stomp'],
                    inPlay: ['terrordactyl', 'dextre']
                },
                player2: {
                    inPlay: ['troll', 'nexus']
                }
            });
        });

        it('should not prompt to exalt a friendly creature if the target is not destroyed', function () {
            this.player1.play(this.stomp);
            expect(this.player1).toBeAbleToSelect(this.terrordactyl);
            expect(this.player1).toBeAbleToSelect(this.nexus);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(5);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prompt to exalt a friendly creature if the target is destroyed', function () {
            this.player1.play(this.stomp);
            expect(this.player1).toBeAbleToSelect(this.terrordactyl);
            expect(this.player1).toBeAbleToSelect(this.nexus);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.nexus);
            expect(this.nexus.location).toBe('discard');
            expect(this.player1).toHavePrompt('Stomp');
            expect(this.player1).toBeAbleToSelect(this.terrordactyl);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.dextre);
            expect(this.dextre.tokens.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
