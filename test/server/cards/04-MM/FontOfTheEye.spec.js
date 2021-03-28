describe('Font of the eye', function () {
    describe("Font of the eye's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['bumpsy', 'font-of-the-eye'],
                    hand: ['punch', 'first-blood']
                },
                player2: {
                    inPlay: ['selwyn-the-fence'],
                    amber: 3
                }
            });
        });

        it('not allow a capture if no creatures have been destroyed', function () {
            this.player1.useAction(this.fontOfTheEye, true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('allow a friendly creature to capture 1 if an enemy was destroyed', function () {
            this.player1.fightWith(this.bumpsy, this.selwynTheFence);
            this.player1.useAction(this.fontOfTheEye, true);

            expect(this.player1).toBeAbleToSelect(this.bumpsy);
        });

        it('should capture when selecting a creature after an enemy has been destroyed', function () {
            this.player1.fightWith(this.bumpsy, this.selwynTheFence);
            this.player1.useAction(this.fontOfTheEye, true);

            this.player1.clickCard(this.bumpsy);

            expect(this.bumpsy.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
        });
    });
});
