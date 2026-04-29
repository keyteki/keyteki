describe("Ol' Switcheroo", function () {
    describe("Ol' Switcheroo's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['ol--switcheroo'],
                    inPlay: ['echofly']
                },
                player2: {}
            });
        });

        it('captures 1 amber on a friendly creature, then gives control to opponent', function () {
            this.player2.amber = 2;
            this.player1.play(this.olSwitcheroo);
            expect(this.player1).toBeAbleToSelect(this.echofly);
            this.player1.clickCard(this.echofly);
            expect(this.echofly.amber).toBe(1);
            expect(this.echofly.controller).toBe(this.player2.player);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Ol' Switcheroo with no friendly creatures", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['ol--switcheroo']
                },
                player2: { amber: 2 }
            });
        });

        it('does nothing if no friendly creature exists', function () {
            this.player1.play(this.olSwitcheroo);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
