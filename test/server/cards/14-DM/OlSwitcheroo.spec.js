describe("Ol' Switcheroo", function () {
    describe("Ol' Switcheroo's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['ol--switcheroo'],
                    inPlay: ['echofly', 'shadys', 'troll']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'urchin']
                }
            });
        });

        it('captures 1 amber on a friendly creature, then gives control to opponent', function () {
            this.player1.play(this.olSwitcheroo);
            expect(this.player1).toBeAbleToSelect(this.echofly);
            expect(this.player1).toBeAbleToSelect(this.shadys);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.echofly);
            this.player1.clickPrompt('Right');
            expect(this.echofly.amber).toBe(1);
            expect(this.echofly.controller).toBe(this.player2.player);
            expect(this.shadys.controller).toBe(this.player1.player);
            expect(this.troll.controller).toBe(this.player1.player);
            expect(this.lamindra.controller).toBe(this.player2.player);
            expect(this.urchin.controller).toBe(this.player2.player);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();

            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            expect(this.echofly.controller).toBe(this.player2.player);
            this.player2.endTurn();
            this.player1.clickPrompt('geistoid');
            expect(this.echofly.controller).toBe(this.player2.player);
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
