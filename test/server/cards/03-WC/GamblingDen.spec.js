describe('Gambling Den', function () {
    describe("Gambling Den's constant ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'shadows',
                    inPlay: ['gambling-den'],
                    hand: ['lamindra']
                },
                player2: {
                    amber: 6,
                    hand: ['troll', 'krump']
                }
            });
        });
        it('should ask player2 to gamble for house and cancel', function () {
            this.player2.moveCard(this.troll, 'deck');
            this.player1.endTurn();
            expect(this.player2).toHavePrompt('Any reactions to key phase starting?');
            expect(this.player2).toHavePromptButton('Done');
            expect(this.player2).toBeAbleToSelect(this.gamblingDen);
            this.player2.clickPrompt('Done');
            expect(this.player2).not.toHavePrompt('Gamble for amber?');
            expect(this.player2.amber).toBe(6);
            expect(this.player1.amber).toBe(5);
            this.player2.forgeKey('Red');
            expect(this.player2.player.getForgedKeys()).toBe(1);
            expect(this.player2.amber).toBe(0);
        });
        it('should ask player2 to gamble for house and gain 2 ambers', function () {
            this.player2.moveCard(this.troll, 'deck');
            this.player1.endTurn();
            expect(this.player2).toBeAbleToSelect(this.gamblingDen);
            this.player2.clickCard(this.gamblingDen);
            expect(this.player2).toHavePrompt('Gamble for amber?');
            this.player2.clickPrompt('brobnar');
            expect(this.player2.amber).toBe(8);
            expect(this.player1.amber).toBe(5);
            this.player2.forgeKey('Red');
            expect(this.player2.player.getForgedKeys()).toBe(1);
            expect(this.player2.amber).toBe(2);
        });
        it('should ask player2 to gamble for house and lose 2 ambers', function () {
            this.player2.moveCard(this.troll, 'deck');
            this.player1.endTurn();
            expect(this.player2).toBeAbleToSelect(this.gamblingDen);
            this.player2.clickCard(this.gamblingDen);
            expect(this.player2).toHavePrompt('Gamble for amber?');
            this.player2.clickPrompt('saurian');
            expect(this.player2.amber).toBe(4);
            expect(this.player1.amber).toBe(5);
            expect(this.player2).not.toHavePrompt('Which key would you like to forge?');
        });

        it('should ask player1 to gamble for house and cancel', function () {
            this.player1.moveCard(this.lamindra, 'deck');
            this.player2.moveCard(this.troll, 'deck');
            this.player1.endTurn();
            this.player2.clickPrompt('Done');
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();

            expect(this.player1).toHavePrompt('Any reactions to key phase starting?');
            expect(this.player1).toHavePromptButton('Done');
            expect(this.player1).toBeAbleToSelect(this.gamblingDen);
            expect(this.player1).not.toHavePrompt('Gamble for amber?');
            this.player1.clickPrompt('Done');
            expect(this.player2.amber).toBe(0);
            expect(this.player1.amber).toBe(5);
        });
        it('should ask player1 to gamble for house and gain 2 ambers', function () {
            this.player1.moveCard(this.lamindra, 'deck');
            this.player2.moveCard(this.troll, 'deck');
            this.player1.endTurn();
            this.player2.clickPrompt('Done');
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();

            expect(this.player1).toBeAbleToSelect(this.gamblingDen);
            this.player1.clickCard(this.gamblingDen);
            expect(this.player1).toHavePrompt('Gamble for amber?');
            this.player1.clickPrompt('shadows');
            expect(this.player2.amber).toBe(0);
            expect(this.player1.amber).toBe(7);
            this.player1.forgeKey('Red');
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.player1.amber).toBe(1);
        });
        it('should ask player1 to gamble for house and lose 2 ambers', function () {
            this.player1.moveCard(this.lamindra, 'deck');
            this.player2.moveCard(this.troll, 'deck');
            this.player1.endTurn();
            this.player2.clickPrompt('Done');
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();

            expect(this.player1).toBeAbleToSelect(this.gamblingDen);
            this.player1.clickCard(this.gamblingDen);
            expect(this.player1).toHavePrompt('Gamble for amber?');
            this.player1.clickPrompt('brobnar');
            expect(this.player2.amber).toBe(0);
            expect(this.player1.amber).toBe(3);
        });

        it('should not ask for gamble if empty deck', function () {
            this.player2.player.deck = [];
            this.player1.endTurn();
            expect(this.player2).not.toHavePrompt('Any reactions to key phase starting?');
            this.player2.forgeKey('Red');
            expect(this.player2.player.getForgedKeys()).toBe(1);
        });
    });
});
