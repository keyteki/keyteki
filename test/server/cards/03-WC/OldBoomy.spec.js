describe('Old Boomy', function () {
    describe("Old Boomy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['old-boomy'],
                    hand: ['blood-of-titans'],
                    discard: ['troll', 'batdrone', 'dextre', 'zorg']
                }
            });
            this.player1.moveCard(this.troll, 'deck');
            this.player1.playUpgrade(this.bloodOfTitans, this.oldBoomy);
        });

        it('should archive the card and damage Old Boomy if the first card is brobnar', function () {
            expect(this.player1.player.deck[0]).toBe(this.troll);
            this.player1.reap(this.oldBoomy);
            expect(this.oldBoomy.tokens.damage).toBe(2);
            expect(this.troll.location).toBe('archives');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should archive the card and prompt the player if the first card is not brobnar', function () {
            this.player1.moveCard(this.dextre, 'deck');
            this.player1.moveCard(this.batdrone, 'deck');
            this.player1.reap(this.oldBoomy);
            expect(this.oldBoomy.hasToken('damage')).toBe(false);
            expect(this.batdrone.location).toBe('archives');
            expect(this.player1).toHavePrompt('Select One');
            this.player1.clickPrompt('Reveal top card');
            expect(this.oldBoomy.hasToken('damage')).toBe(false);
            expect(this.dextre.location).toBe('archives');
            expect(this.player1).toHavePrompt('Select One');
            this.player1.clickPrompt('Stop');
            expect(this.oldBoomy.hasToken('damage')).toBe(false);
            expect(this.player1.player.deck[0]).toBe(this.troll);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should continue to resolve the ability until a brobnar card is revealed', function () {
            this.player1.moveCard(this.dextre, 'deck');
            this.player1.moveCard(this.batdrone, 'deck');
            this.player1.reap(this.oldBoomy);
            expect(this.oldBoomy.hasToken('damage')).toBe(false);
            expect(this.batdrone.location).toBe('archives');
            expect(this.player1).toHavePrompt('Select One');
            this.player1.clickPrompt('Reveal top card');
            expect(this.oldBoomy.hasToken('damage')).toBe(false);
            expect(this.dextre.location).toBe('archives');
            expect(this.player1).toHavePrompt('Select One');
            this.player1.clickPrompt('Reveal top card');
            expect(this.oldBoomy.tokens.damage).toBe(2);
            expect(this.troll.location).toBe('archives');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
