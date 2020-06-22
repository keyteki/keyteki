describe('Brain Eater', function () {
    describe("Brain Eater's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['brain-eater']
                },
                player2: {
                    inPlay: ['doc-bookton']
                }
            });
        });

        it('should draw a card when it attacks and destroys a creature', function () {
            let handSize = this.player1.hand.length;
            this.player1.fightWith(this.brainEater, this.docBookton);
            expect(this.docBookton.location).toBe('discard');
            expect(this.brainEater.tokens.damage).toBe(5);
            expect(this.player1.hand.length).toBe(handSize + 1);
        });

        it('should draw a card when it is attacked and the attacker is destroyed', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            let handSize = this.player1.hand.length;
            this.player2.fightWith(this.docBookton, this.brainEater);
            expect(this.docBookton.location).toBe('discard');
            expect(this.brainEater.tokens.damage).toBe(5);
            expect(this.player1.hand.length).toBe(handSize + 1);
        });
    });
});
