describe('Talent Scout', function () {
    describe("Talent Scout's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'ekwidon',
                    inPlay: ['pelf'],
                    hand: ['talent-scout']
                },
                player2: {
                    amber: 2,
                    hand: [
                        'selwyn-the-fence',
                        'ring-of-invisibility',
                        'bumpsy',
                        'too-much-to-protect'
                    ]
                }
            });
        });

        it('allows player to play a creature from opponent hand', function () {
            this.player1.playCreature(this.talentScout);
            expect(this.player1.amber).toBe(3);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickPrompt('Left');
            expect(this.player2.amber).toBe(1);
            expect(this.player1.player.cardsInPlay).toContain(this.bumpsy);
            expect(this.player1.player.cardsInPlay).not.toContain(this.talentScout);
            expect(this.player2.player.cardsInPlay).not.toContain(this.bumpsy);
            expect(this.player2.player.cardsInPlay).toContain(this.talentScout);
        });
    });
});
