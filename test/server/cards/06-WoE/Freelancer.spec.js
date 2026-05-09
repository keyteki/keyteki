describe('Freelancer', function () {
    describe("Freelancer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    inPlay: ['pelf'],
                    hand: ['freelancer']
                },
                player2: {
                    inPlay: ['dust-imp']
                }
            });
        });

        it('should take give control of a creature at start of next round', function () {
            this.player1.playUpgrade(this.freelancer, this.pelf);
            this.player1.endTurn();
            this.player2.clickPrompt('Left');
            this.player2.clickPrompt('untamed');
            expect(this.pelf.location).toBe('play area');
            expect(this.pelf.upgrades).toContain(this.freelancer);
            expect(this.player2.player.cardsInPlay).toContain(this.pelf);
            expect(this.player1.player.cardsInPlay).not.toContain(this.pelf);
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            expect(this.pelf.location).toBe('play area');
            expect(this.pelf.upgrades).toContain(this.freelancer);
            expect(this.player1.player.cardsInPlay).toContain(this.pelf);
            expect(this.player2.player.cardsInPlay).not.toContain(this.pelf);
        });

        it('should be usable in the active house', function () {
            this.player1.playUpgrade(this.freelancer, this.pelf);
            this.player1.reap(this.pelf);
            expect(this.player1.amber).toBe(2);
            this.player1.endTurn();
            this.player2.clickPrompt('Left');
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.pelf);
            expect(this.player2.amber).toBe(1);
        });

        it('should work on enemy creatures', function () {
            this.player1.playUpgrade(this.freelancer, this.dustImp);
            expect(this.dustImp.location).toBe('play area');
            expect(this.dustImp.upgrades).toContain(this.freelancer);
            expect(this.player2.player.cardsInPlay).toContain(this.dustImp);
            expect(this.player1.player.cardsInPlay).not.toContain(this.dustImp);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.dustImp.location).toBe('play area');
            expect(this.dustImp.upgrades).toContain(this.freelancer);
            expect(this.player2.player.cardsInPlay).toContain(this.dustImp);
            expect(this.player1.player.cardsInPlay).not.toContain(this.dustImp);
            this.player2.endTurn();
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('ekwidon');
            expect(this.dustImp.location).toBe('play area');
            expect(this.dustImp.upgrades).toContain(this.freelancer);
            expect(this.player1.player.cardsInPlay).toContain(this.dustImp);
            expect(this.player2.player.cardsInPlay).not.toContain(this.dustImp);
        });

        it('should move tokens', function () {
            this.pelf.amber = 1;
            this.player1.playUpgrade(this.freelancer, this.pelf);
            this.player1.endTurn();
            this.player2.clickPrompt('Left');
            this.player2.clickPrompt('untamed');
            expect(this.pelf.amber).toBe(1);
        });
    });
});
