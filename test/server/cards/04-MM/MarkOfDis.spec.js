fdescribe('Mark of Dis', function () {
    integration(function () {
        describe("Mark of Dis's ability", function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        house: 'dis',
                        inPlay: ['dodger', 'silvertooth'],
                        hand: ['mark-of-dis']
                    },
                    player2: {
                        inPlay: ['urchin', 'sneklifter', 'shadow-self'],
                        hand: ['shooler'],
                        amber: 3
                    }
                });
            });

            it('if own creature is destroyed, should not restrict house choice', function () {
                this.player1.play(this.markOfDis);
                this.player1.clickCard(this.silvertooth);
                expect(this.silvertooth.location).toBe('discard');

                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.endTurn();

                expect(this.player1).toHavePromptButton('shadows');
            });

            it("if opponent's creature is destroyed, should not restrict opponent's house choice", function () {
                this.player1.play(this.markOfDis);
                this.player1.clickCard(this.urchin);
                expect(this.urchin.location).toBe('discard');

                this.player1.endTurn();

                expect(this.player2).toHavePromptButton('shadows');
            });

            // Disabled until issue with duration is fixed
            xit('if own creature is not destroyed, should restrict house choice', function () {
                this.player1.play(this.markOfDis);
                this.player1.clickCard(this.dodger);
                expect(this.dodger.tokens.damage).toBe(2);

                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.endTurn();

                expect(this.player1).not.toHavePromptButton('dis');
                expect(this.player1).toHavePromptButton('shadows');
            });

            it("if opponent's creature is not destroyed, should restrict opponent's house choice", function () {
                this.player1.play(this.markOfDis);
                this.player1.clickCard(this.sneklifter);

                expect(this.sneklifter.location).toBe('play area');
                expect(this.sneklifter.tokens.damage).toBeUndefined();
                expect(this.shadowSelf.tokens.damage).toBe(2);

                this.player1.endTurn();
                expect(this.player2).not.toHavePromptButton('dis');
                expect(this.player2).toHavePromptButton('shadows');
            });

            it('should restict house choice if target is warded', function () {
                this.urchin.ward();
                this.player1.play(this.markOfDis);
                this.player1.clickCard(this.urchin);
                expect(this.urchin.location).toBe('play area');
                expect(this.urchin.warded).toBe(false);

                this.player1.endTurn();
                expect(this.player2).not.toHavePromptButton('dis');
                expect(this.player2).toHavePromptButton('shadows');
            });
        });
    });
});
