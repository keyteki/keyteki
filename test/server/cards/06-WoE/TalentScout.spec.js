describe('Talent Scout', function () {
    describe("Talent Scout's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'ekwidon',
                    inPlay: ['pelf'],
                    hand: ['talent-scout', 'bubbles']
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

        it('still reveals hand when there are no creatures', function () {
            this.selwynTheFence.location = 'discard';
            this.bumpsy.location = 'discard';

            this.player1.playCreature(this.talentScout);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
            expect(this.player1.player.cardsInPlay).not.toContain(this.talentScout);
            expect(this.player2.player.cardsInPlay).toContain(this.talentScout);
            expect(this).toHaveRecentChatMessage('Talent Scout reveals Too Much to Protect', 2);
            expect(this).toHaveRecentChatMessage('Talent Scout reveals Ring of Invisibility', 2);
        });

        it('allows player to return to own deck with Bubbles', function () {
            this.player1.playCreature(this.talentScout);
            expect(this.player1.amber).toBe(3);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickPrompt('Left');
            expect(this.player2.amber).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');
            this.player1.playCreature(this.bubbles);
            this.player1.clickCard(this.talentScout);
            expect(this.talentScout.location).toBe('deck');
            this.player1.endTurn();
            expect(this.talentScout.location).toBe('hand');
        });

        describe("after ability resolved, on opponent's turn", function () {
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
