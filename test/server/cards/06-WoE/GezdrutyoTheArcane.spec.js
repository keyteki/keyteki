describe('Gĕzdrutyŏ the Arcane', function () {
    describe("Gĕzdrutyŏ the Arcane's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    amber: 1,
                    token: 'scholar',
                    hand: ['senator-shrix'],
                    inPlay: ['gĕzdrutyŏ-the-arcane']
                },
                player2: {
                    amber: 5,
                    inPlay: ['gub', 'krump']
                }
            });

            this.player1.useAction(this.gĕzdrutyŏTheArcane);
        });

        it('should steal 2A and flip', function () {
            expect(this.player1.amber).toBe(3);
            expect(this.player1.amber).toBe(3);
            expect(this.gĕzdrutyŏTheArcane.name).toBe('Scholar');
        });

        describe('after becoming Scholar', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('dis');
                this.player2.endTurn();
                this.player1.clickPrompt('saurian');
            });

            it('should not be able to use action as Gezdrutyo', function () {
                this.player1.clickCard(this.gĕzdrutyŏTheArcane);
                expect(this.player1).toHavePromptButton('Reap with this creature');
                expect(this.player1).toHavePromptButton('Fight with this creature');
                expect(this.player1).not.toHavePromptButton("Use this card's Action ability");
            });

            it('should draw a card after reap as Scholar', function () {
                expect(this.player1.hand.length).toBe(6);
                this.player1.reap(this.gĕzdrutyŏTheArcane);
                expect(this.player1.amber).toBe(4);
                expect(this.player1.hand.length).toBe(7);
                this.player1.endTurn();
            });
        });
    });
});
