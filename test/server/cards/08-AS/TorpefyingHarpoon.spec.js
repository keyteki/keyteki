describe('Torpefying Harpoon', function () {
    describe("Torpefying Harpoon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    hand: ['torpefying-harpoon', 'bosun-creen'],
                    inPlay: ['dust-pixie', 'hunting-witch']
                },
                player2: {
                    hand: ['tyxl-beambuckler']
                }
            });
        });

        it('should destroy non-flank creature at end of turn', function () {
            this.player1.playUpgrade(this.torpefyingHarpoon, this.dustPixie);
            this.player1.playCreature(this.bosunCreen, true);
            this.player1.endTurn();
            expect(this.dustPixie.location).toBe('discard');
            this.player2.clickPrompt('mars');
        });

        it('should not destroy flank creature at end of turn', function () {
            this.player1.playUpgrade(this.torpefyingHarpoon, this.dustPixie);
            this.player1.endTurn();
            expect(this.dustPixie.location).toBe('play area');
            this.player2.clickPrompt('mars');
        });

        it('should not destroy non-flank creature at end of opponent turn', function () {
            this.player1.playUpgrade(this.torpefyingHarpoon, this.dustPixie);
            this.player1.playCreature(this.bosunCreen);
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.playCreature(this.tyxlBeambuckler);
            this.player2.clickCard(this.bosunCreen);
            this.player2.clickPrompt('Left');
            this.player2.endTurn();
            expect(this.dustPixie.location).toBe('play area');
            this.player1.clickPrompt('skyborn');
            this.player1.endTurn();
            expect(this.dustPixie.location).toBe('discard');
            this.player2.clickPrompt('mars');
        });
    });
});
