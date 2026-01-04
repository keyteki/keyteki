describe('Minion', function () {
    describe("Minion's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    token: 'minion',
                    hand: ['a-strong-feeling'],
                    inPlay: ['minion:toad'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    hand: ['helper-bot'],
                    discard: new Array(9).fill('poke') // not yet haunted
                }
            });

            this.minion = this.player1.player.creaturesInPlay[0];
        });

        it('should do nothing on reap if neither player is haunted', function () {
            let p = this.player1.discard[0];
            this.player1.reap(this.minion);
            expect(p.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should work for one haunted player', function () {
            this.player1.scrap(this.aStrongFeeling);
            this.player1.reap(this.minion);
            expect(this.aStrongFeeling.location).toBe('deck');
            expect(this.player1.player.deck[0]).toBe(this.aStrongFeeling);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should work for haunted opponent', function () {
            this.player1.scrap(this.aStrongFeeling);
            this.player2.moveCard(this.helperBot, 'discard');
            this.player1.reap(this.minion);
            expect(this.player1).toHavePromptButton('Mine');
            expect(this.player1).toHavePromptButton("Opponent's");
            this.player1.clickPrompt("Opponent's");
            expect(this.helperBot.location).toBe('deck');
            expect(this.player2.player.deck[0]).toBe(this.helperBot);
            expect(this.aStrongFeeling.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
