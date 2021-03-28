describe('Malison', function () {
    describe('the fight ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    amber: 1,
                    inPlay: ['narp', 'malison']
                },
                player2: {
                    amber: 3,
                    inPlay: ['shadow-self', 'troll', 'tezmal', 'silver-key-imp']
                }
            });
        });

        describe('when fighting a creature', function () {
            beforeEach(function () {
                this.player1.fightWith(this.malison, this.tezmal);
            });

            it('should prompt to move an enemy creature', function () {
                expect(this.player1).not.toBeAbleToSelect(this.narp);
                expect(this.player1).toBeAbleToSelect(this.shadowSelf);
            });

            describe('when an enemy creature is selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.troll);
                });

                it('should prompt for a creature to move next to', function () {
                    expect(this.player1).toHavePrompt('Select a card to move this card next to');
                });

                describe('when a creature is selected', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.shadowSelf);
                    });

                    it('should prompt which side of the creature to move to', function () {
                        expect(this.player1).toHavePrompt(
                            'Which side to you want to move this card to?'
                        );
                        expect(this.player1).toHavePromptButton('Left');
                        expect(this.player1).toHavePromptButton('Right');
                    });

                    describe('when the left side is selected', function () {
                        beforeEach(function () {
                            this.player1.clickPrompt('Left');
                        });

                        it('should move the first selected card to the left of the second selected card', function () {
                            expect(this.player2.player.cardsInPlay[0]).toBe(this.troll);
                            expect(this.player2.player.cardsInPlay[1]).toBe(this.shadowSelf);
                            expect(this.player2.player.cardsInPlay[2]).toBe(this.tezmal);
                        });

                        it('should capture 1 amber from its own side as it is on a flank', function () {
                            expect(this.troll.tokens.amber).toBe(1);
                            expect(this.player2.amber).toBe(2);
                        });
                    });

                    describe('when the right side is selected', function () {
                        beforeEach(function () {
                            this.player1.clickPrompt('Right');
                        });

                        it('should move the first selected card to the left of the second selected card', function () {
                            expect(this.player2.player.cardsInPlay[0]).toBe(this.shadowSelf);
                            expect(this.player2.player.cardsInPlay[1]).toBe(this.troll);
                            expect(this.player2.player.cardsInPlay[2]).toBe(this.tezmal);
                        });

                        it('should not capture 1 amber from its own side as it is not on a flank', function () {
                            expect(this.troll.tokens.amber).toBe(undefined);
                            expect(this.player2.amber).toBe(3);
                        });
                    });
                });
            });
        });
    });
});
