describe('Shĭzyokŭ Swopper', function () {
    describe("Shĭzyokŭ Swopper's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: [],
                    inPlay: ['shĭzyokŭ-swopper']
                },
                player2: {
                    inPlay: ['bad-penny', 'helper-bot', 'mother', 'troll']
                }
            });
        });

        it('should swap with the defender, if both survived the fight', function () {
            this.player1.fightWith(this.shĭzyokŭSwopper, this.mother);
            expect(this.player2.player.cardsInPlay).toContain(this.shĭzyokŭSwopper);
            expect(this.player1.player.cardsInPlay).not.toContain(this.shĭzyokŭSwopper);
            expect(this.player1.player.cardsInPlay).toContain(this.mother);
            expect(this.player2.player.cardsInPlay).not.toContain(this.mother);
            expect(this.mother.tokens.damage).toBe(1);
        });

        it('should not swap with the defender, if the defender was destroyed.', function () {
            this.player1.fightWith(this.shĭzyokŭSwopper, this.helperBot);
            expect(this.player1.player.cardsInPlay).toContain(this.shĭzyokŭSwopper);
            expect(this.player2.player.cardsInPlay).not.toContain(this.shĭzyokŭSwopper);
            expect(this.helperBot.location).toBe('discard');
        });

        it('should not swap with the defender, if the Swopper was destroyed.', function () {
            this.player1.fightWith(this.shĭzyokŭSwopper, this.troll);
            expect(this.player2.player.cardsInPlay).toContain(this.troll);
            expect(this.player1.player.cardsInPlay).not.toContain(this.troll);
            expect(this.shĭzyokŭSwopper.location).toBe('discard');
        });
    });
});
