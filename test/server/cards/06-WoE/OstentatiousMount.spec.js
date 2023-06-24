describe('OstentatiousMount:', function () {
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

    describe('play upgrade on friendly creature', function () {
        beforeEach(function () {
            this.player1.playUpgrade(this.ostentatiousMount, this.chelonia);
        });

        it('should provide a prompt to move the creature', function () {
            expect(this.player1).toHavePrompt('Select a card to move this card next to');
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
        });

        describe('and move creature', function () {
            beforeEach(function () {
                this.player1.clickCard(this.gub);
                this.player1.clickPrompt('Left');
            });

            it('should move the creature', function () {
                expect(this.player1.player.cardsInPlay[0]).toBe(this.flaxia);
                expect(this.player1.player.cardsInPlay[1]).toBe(this.chelonia);
                expect(this.player1.player.cardsInPlay[2]).toBe(this.gub);
            });

            it('should give taunt', function () {
                expect(this.chelonia.hasKeyword('taunt')).toBe(true);
            });
        });
    });

    describe('play upgrade on enemy creature', function () {
        beforeEach(function () {
            this.player1.playUpgrade(this.ostentatiousMount, this.urchin);
        });

        it('should show for select enemy creatures only', function () {
            expect(this.player1).toHavePrompt('Select a card to move this card next to');
            expect(this.player1).toBeAbleToSelect(this.hookmaster);
            expect(this.player1).not.toBeAbleToSelect(this.chelonia);
        });

        describe('and move creature', function () {
            beforeEach(function () {
                this.player1.clickCard(this.floomf);
                this.player1.clickPrompt('Left');
            });

            it('should move the creature', function () {
                expect(this.player2.player.cardsInPlay[0]).toBe(this.hookmaster);
                expect(this.player2.player.cardsInPlay[1]).toBe(this.urchin);
                expect(this.player2.player.cardsInPlay[2]).toBe(this.floomf);
            });

            it('should give taunt', function () {
                expect(this.urchin.hasKeyword('taunt')).toBe(true);
            });
        });
    });
});
