describe('Überking Tablets', function () {
    describe('Überking Tablets Ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'brobnar',
                    inPlay: [
                        'brammo',
                        'shorty',
                        'ganger-chieftain',
                        'foozle',
                        'groke',
                        'culf-the-quiet',
                        'überking-tablets'
                    ]
                },
                player2: {
                    amber: 3,
                    inPlay: ['silvertooth', 'gamgee', 'krump', 'troll']
                }
            });
        });

        it('should prompt for ready or exhaust choice', function () {
            this.player1.useAction(this.überkingTablets);
            expect(this.player1).toHavePromptButton('Ready creature');
            expect(this.player1).toHavePromptButton('Exhaust creature');
        });

        describe('when ready creature is selected', function () {
            beforeEach(function () {
                this.player1.reap(this.brammo);
                this.player1.useAction(this.überkingTablets);
                this.player1.clickPrompt('Ready creature');
            });

            it('should be able to select any creature', function () {
                expect(this.player1).toBeAbleToSelect(this.brammo);
                expect(this.player1).toBeAbleToSelect(this.shorty);
                expect(this.player1).toBeAbleToSelect(this.silvertooth);
                expect(this.player1).toBeAbleToSelect(this.gamgee);
            });

            it('should ready and deal damage to selected creature', function () {
                this.player1.clickCard(this.brammo);
                expect(this.brammo.exhausted).toBe(false);
                expect(this.brammo.damage).toBe(1); // armor
                expect(this.player1).isReadyToTakeAction();
            });
        });

        describe('when exhaust creature is selected', function () {
            beforeEach(function () {
                this.player1.useAction(this.überkingTablets);
                this.player1.clickPrompt('Exhaust creature');
            });

            it('should be able to select any creature', function () {
                expect(this.player1).toBeAbleToSelect(this.brammo);
                expect(this.player1).toBeAbleToSelect(this.shorty);
                expect(this.player1).toBeAbleToSelect(this.silvertooth);
                expect(this.player1).toBeAbleToSelect(this.gamgee);
            });

            it('should exhaust and deal damage to selected creature', function () {
                this.player1.clickCard(this.brammo);
                expect(this.brammo.exhausted).toBe(true);
                expect(this.brammo.damage).toBe(1); // armor
            });

            it('should not exhaust and deal damage to already exhausted creature', function () {
                this.brammo.exhausted = true;
                this.player1.clickCard(this.brammo);
                expect(this.brammo.exhausted).toBe(true);
                expect(this.brammo.damage).toBe(0);
            });
        });
    });
});
