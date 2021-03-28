describe('Throium Plasmate', function () {
    describe('the play ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 1,
                    hand: ['thorium-plasmate'],
                    inPlay: ['narp', 'brain-eater']
                },
                player2: {
                    amber: 3,
                    inPlay: ['little-niff', 'troll', 'krump', 'silver-key-imp']
                }
            });

            this.player1.play(this.thoriumPlasmate);
        });

        it('should prompt to move an enemy creature', function () {
            expect(this.player1).not.toBeAbleToSelect(this.narp);
            expect(this.player1).toBeAbleToSelect(this.littleNiff);
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
                    this.player1.clickCard(this.littleNiff);
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
                        expect(this.player2.player.cardsInPlay[1]).toBe(this.littleNiff);
                        expect(this.player2.player.cardsInPlay[2]).toBe(this.krump);
                    });

                    it('should be dealt 2 damage to the creature for each of its neighbors sharing a house', function () {
                        expect(this.troll.tokens.damage).toBe(undefined);
                    });
                });

                describe('when the right side is selected', function () {
                    beforeEach(function () {
                        this.player1.clickPrompt('Right');
                    });

                    it('should move the first selected card to the left of the second selected card', function () {
                        expect(this.player2.player.cardsInPlay[0]).toBe(this.littleNiff);
                        expect(this.player2.player.cardsInPlay[1]).toBe(this.troll);
                        expect(this.player2.player.cardsInPlay[2]).toBe(this.krump);
                    });

                    it('should be dealt 2 damage to the creature for each of its neighbors sharing a house', function () {
                        expect(this.troll.tokens.damage).toBe(2);
                    });
                });
            });
        });
    });

    describe('when moving a card to the right of where it started', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 1,
                    hand: ['thorium-plasmate'],
                    inPlay: ['narp', 'brain-eater']
                },
                player2: {
                    amber: 3,
                    inPlay: ['little-niff', 'alaka', 'shorty', 'krump']
                }
            });
        });

        it('should be able to correctly move cards in the battleline', function () {
            this.player1.play(this.thoriumPlasmate);
            this.player1.clickCard(this.alaka);
            expect(this.player1).toHavePrompt('Select a card to move this card next to');
            this.player1.clickCard(this.shorty);
            expect(this.player1).toHavePrompt('Which side to you want to move this card to?');
            this.player1.clickPrompt('Right');
            expect(this.player2.player.creaturesInPlay.length).toBe(3);
            expect(this.player2.player.cardsInPlay[0]).toBe(this.littleNiff);
            expect(this.player2.player.cardsInPlay[1]).toBe(this.shorty);
            expect(this.player2.player.cardsInPlay[2]).toBe(this.krump);
        });
    });
});
