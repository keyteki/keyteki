describe('Dæmo-Bot', function () {
    describe("Dæmo-Bots's Reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['dæmo-bot', 'old-yurk'],
                    hand: ['soulkeeper']
                },
                player2: {
                    inPlay: ['nexus', 'troll', 'dodger']
                }
            });
        });

        it('should discard a card and draw a card when used to reap', function () {
            this.player1.reap(this.dæmoBot);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Dæmo-Bot');
            expect(this.player1).toBeAbleToSelect(this.soulkeeper);
            this.player1.clickCard(this.soulkeeper);
            expect(this.soulkeeper.location).toBe('discard');
            expect(this.player1.hand.length).toBe(1);
        });

        it("should shouldn't draw a card when used to reap when there is nothing to discard", function () {
            this.player1.moveCard(this.soulkeeper, 'deck');
            this.player1.reap(this.dæmoBot);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            this.player1.clickCard(this.soulkeeper);
            expect(this.soulkeeper.location).toBe('deck');
            expect(this.player1.hand.length).toBe(0);
        });
    });
    describe("Dæmo-Bots's Destroyed ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    inPlay: ['nexus', 'troll', 'dodger']
                },
                player2: {
                    amber: 0,
                    inPlay: ['dæmo-bot', 'old-yurk'],
                    hand: ['soulkeeper']
                }
            });
        });

        it('player 2 should steal 1 amber when dæmo-bot is destroyed', function () {
            this.player1.fightWith(this.troll, this.dæmoBot);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(1);
        });
    });
});
