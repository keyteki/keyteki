describe('Abyssal Sight', function () {
    describe("Abyssal Sight's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['abyssal-sight', 'murkens', 'troll'],
                    inPlay: ['kaupe']
                },
                player2: {
                    inPlay: ['almsmaster'],
                    hand: ['bulwark', 'shooler', 'gorm-of-omm', 'virtuous-works']
                }
            });
        });

        it('should be able to see the cards', function () {
            for (let card of this.player2.player.hand) {
                expect(this.player1.game.isCardVisible(card, this.player1.player)).toBe(false);
            }

            this.player1.play(this.abyssalSight);
            this.player1.clickCard(this.kaupe);
            expect(this.kaupe.location).toBe('discard');
            expect(this.player1).toHavePrompt('Abyssal Sight');

            for (let card of this.player2.player.hand) {
                expect(this.player1.game.isCardVisible(card, this.player1.player)).toBe(true);
            }
        });

        it("should be able to discard card from opponent's hand", function () {
            this.player1.play(this.abyssalSight);
            this.player1.clickCard(this.kaupe);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.gormOfOmm);
            expect(this.player1).toBeAbleToSelect(this.virtuousWorks);
            this.player1.clickCard(this.gormOfOmm);
            expect(this.gormOfOmm.location).toBe('discard');
        });

        it("should not look at the opponent's hand without a friendly creature", function () {
            this.player1.fightWith(this.kaupe, this.almsmaster);
            this.player1.play(this.abyssalSight);
            expect(this.player1).not.toHavePrompt('Abyssal Sight');

            for (let card of this.player2.player.hand) {
                expect(this.player1.game.isCardVisible(card, this.player1.player)).toBe(false);
            }
        });
    });
});
