describe('Lateral Shift', function () {
    describe("Lateral Shift's omni ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 2,
                    hand: ['lateral-shift', 'murkens', 'troll']
                },
                player2: {
                    amber: 6,
                    hand: [
                        'bulwark',
                        'shooler',
                        'gorm-of-omm',
                        'gateway-to-dis',
                        'virtuous-works',
                        'armageddon-cloak'
                    ]
                }
            });
        });

        it('should be able to see the cards', function () {
            for (let card of this.player2.player.hand) {
                expect(this.player1.game.isCardVisible(card, this.player1.player)).toBe(false);
            }

            this.player1.play(this.lateralShift);
            expect(this.player1).toHavePrompt('Lateral Shift');

            for (let card of this.player2.player.hand) {
                expect(this.player1.game.isCardVisible(card, this.player1.player)).toBe(true);
            }
        });

        it("should be able to play a creature from opponent's hand", function () {
            this.player1.play(this.lateralShift);
            expect(this.player1).toHavePrompt('Lateral Shift');
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).not.toBeAbleToSelect(this.murkens);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.shooler);
            expect(this.shooler.location).toBe('play area');
            expect(this.player1.player.cardsInPlay).toContain(this.shooler);
            expect(this.player2.player.cardsInPlay).not.toContain(this.shooler);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it("should be able to play an artifact from opponent's hand", function () {
            this.player1.play(this.lateralShift);
            expect(this.player1).toHavePrompt('Lateral Shift');
            this.player1.clickCard(this.gormOfOmm);
            expect(this.gormOfOmm.location).toBe('play area');
            expect(this.player1.player.cardsInPlay).toContain(this.gormOfOmm);
            expect(this.player2.player.cardsInPlay).not.toContain(this.gormOfOmm);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it("should be able to play an action from opponent's hand", function () {
            this.player1.play(this.lateralShift);
            expect(this.player1).toHavePrompt('Lateral Shift');
            this.player1.clickCard(this.virtuousWorks);
            expect(this.player1.amber).toBe(5);
            expect(this.lateralShift.location).toBe('discard');
            expect(this.player1.player.discard).not.toContain(this.virtuousWorks);
            expect(this.player2.player.discard).toContain(this.virtuousWorks);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not be able to play an upgrade since there is no creature in play', function () {
            this.player1.play(this.lateralShift);
            expect(this.player1).toHavePrompt('Lateral Shift');
            expect(this.player1).not.toBeAbleToSelect(this.armageddonCloak);
        });

        it('should not be able to play an upgrade if there is a creature in play', function () {
            this.player1.play(this.troll);
            this.player1.play(this.lateralShift);
            expect(this.player1).toHavePrompt('Lateral Shift');
            expect(this.player1).toBeAbleToSelect(this.armageddonCloak);
            this.player1.clickCard(this.armageddonCloak);
            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
