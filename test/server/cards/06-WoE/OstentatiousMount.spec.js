describe('OstentatiousMount', function () {
    describe('Upgrade test', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 2,
                    inPlay: ['chelonia', 'flaxia', 'gub'],
                    hand: ['ostentatious-mount']
                },
                player2: {
                    inPlay: ['urchin', 'hookmaster', 'floomf']
                }
            });
        });

        it('should give 1A', function () {
            this.player1.playUpgrade(this.ostentatiousMount, this.chelonia);

            expect(this.player1.player.amber).toBe(3);
        });

        it('should provide a prompt to move the creature', function () {
            this.player1.playUpgrade(this.ostentatiousMount, this.chelonia);

            expect(this.player1).toHavePrompt('Select a card to move this card next to');
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
        });

        it('should move the creature', function () {
            this.player1.playUpgrade(this.ostentatiousMount, this.chelonia);
            this.player1.clickCard(this.gub);
            this.player1.clickPrompt('Left');

            expect(this.player1.player.cardsInPlay[0]).toBe(this.flaxia);
            expect(this.player1.player.cardsInPlay[1]).toBe(this.chelonia);
            expect(this.player1.player.cardsInPlay[2]).toBe(this.gub);
        });

        it('should give taunt', function () {
            this.player1.playUpgrade(this.ostentatiousMount, this.chelonia);
            this.player1.clickCard(this.gub);
            this.player1.clickPrompt('Left');

            expect(this.chelonia.hasKeyword('taunt')).toBe(true);
        });

        describe('should be playable on enemy creatures', function () {
            it('should select enemy creatures', function () {
                this.player1.playUpgrade(this.ostentatiousMount, this.urchin);

                expect(this.player1).toHavePrompt('Select a card to move this card next to');
                expect(this.player1).toBeAbleToSelect(this.hookmaster);
                expect(this.player1).not.toBeAbleToSelect(this.chelonia);
            });

            it('should move and give taunt to enemy creature', function () {
                this.player1.playUpgrade(this.ostentatiousMount, this.urchin);
                this.player1.clickCard(this.floomf);
                this.player1.clickPrompt('Left');

                expect(this.player1.player.amber).toBe(3);
                expect(this.urchin.hasKeyword('taunt')).toBe(true);
                expect(this.player2.player.cardsInPlay[0]).toBe(this.hookmaster);
                expect(this.player2.player.cardsInPlay[1]).toBe(this.urchin);
                expect(this.player2.player.cardsInPlay[2]).toBe(this.floomf);
            });
        });
    });
});
