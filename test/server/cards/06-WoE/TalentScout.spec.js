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

        describe("after ability resolved, on opponnent's turn", function () {
            beforeEach(function () {
                this.player1.playCreature(this.talentScout);
                this.player1.clickCard(this.bumpsy);
                this.player1.clickPrompt('Left');
                this.player1.endTurn();

                // repeat to remove exhaust
                this.player2.clickPrompt('shadows');
                this.player2.endTurn();

                this.player1.clickPrompt('ekwidon');
                this.player1.endTurn();

                this.player2.clickPrompt('shadows');
            });

            it('opponent should be able to use Talent Scout as any house', function () {
                let initialAmber = this.player2.amber;

                this.player2.reap(this.talentScout);

                expect(this.player2.amber).toBe(initialAmber + 1);
            });
        });
    });
});
