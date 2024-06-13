describe('Collar of Subordination', function () {
    describe("Collar of Subordination's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['collar-of-subordination', 'ember-imp']
                },
                player2: {
                    inPlay: ['dust-imp', 'dextre']
                }
            });
        });

        it('should take control of a creature', function () {
            this.player1.playUpgrade(this.collarOfSubordination, this.dustImp);
            expect(this.dustImp.location).toBe('play area');
            expect(this.dustImp.upgrades).toContain(this.collarOfSubordination);
            expect(this.player1.player.cardsInPlay).toContain(this.dustImp);
            expect(this.player2.player.cardsInPlay).not.toContain(this.dustImp);
        });

        it("should return to it's ownders discard", function () {
            this.player1.playUpgrade(this.collarOfSubordination, this.dustImp);
            this.player1.fightWith(this.dustImp, this.dextre);
            expect(this.dustImp.location).toBe('discard');
            expect(this.player2.discard).toContain(this.dustImp);
            expect(this.player1.discard).not.toContain(this.dustImp);
            expect(this.player1.player.cardsInPlay).not.toContain(this.dustImp);
        });

        it('should prompt the player to place it on the correct side', function () {
            this.player1.play(this.emberImp);
            expect(this.player1.player.cardsInPlay[0]).toBe(this.emberImp);
            this.player1.playUpgrade(this.collarOfSubordination, this.dustImp);
            expect(this.player1).toHavePrompt('Dust Imp');
            this.player1.clickPrompt('left');
            expect(this.player1.player.cardsInPlay[0]).toBe(this.dustImp);
        });
    });
});
