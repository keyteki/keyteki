describe('Brain Drain', function () {
    describe("Brain Drain's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 2,
                    hand: ['brain-drain', 'murkens', 'troll'],
                    inPlay: ['kaupe']
                },
                player2: {
                    amber: 6,
                    inPlay: ['cændle-unit'],
                    hand: ['bulwark', 'shooler', 'gorm-of-omm', 'virtuous-works']
                }
            });
        });

        it('should be able to see the cards', function () {
            for (let card of this.player2.player.hand) {
                expect(this.player1.game.isCardVisible(card, this.player1.player)).toBe(false);
            }

            this.player1.play(this.brainDrain);
            expect(this.player1).toHavePrompt('Brain Drain');

            for (let card of this.player2.player.hand) {
                expect(this.player1.game.isCardVisible(card, this.player1.player)).toBe(true);
            }
        });

        it("should be able to move a card from opponent's hand to top of deck", function () {
            this.player1.play(this.brainDrain);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.gormOfOmm);
            expect(this.player1).toBeAbleToSelect(this.virtuousWorks);
            this.player1.clickCard(this.gormOfOmm);
            expect(this.gormOfOmm.location).toBe('deck');

            this.player1.reap(this.kaupe);
            expect(this.gormOfOmm.location).toBe('hand');
        });
    });
});
