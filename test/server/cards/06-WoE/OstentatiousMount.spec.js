describe('OstentatiousMount', function () {
    describe('Upgrade test', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['chelonia', 'flaxia', 'gub'],
                    hand: ['ostentatious-mount']
                },
                player2: {
                    inPlay: ['urchin', 'bad-penny', 'rad-penny']
                }
            });
        });

        it('should provide a prompt to move the creature', function () {
            this.player1.playUpgrade(this.ostentatiousMount, this.chelonia);

            expect(this.player1).toHavePrompt('Select a card to move this card next to');
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
    });
});
