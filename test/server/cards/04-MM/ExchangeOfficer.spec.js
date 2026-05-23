describe('Exchange Officer', function () {
    describe("Exchange Officer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['exchange-officer'],
                    inPlay: ['hayden-oswin']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('uses a friendly Star Alliance card on play', function () {
            this.player1.play(this.exchangeOfficer);
            expect(this.player1).toBeAbleToSelect(this.haydenOswin);
            this.player1.clickCard(this.haydenOswin);
            expect(this.player1.amber).toBe(1);
            expect(this.haydenOswin.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Exchange Officer's reap and fight abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['exchange-officer', 'hayden-oswin']
                },
                player2: {
                    inPlay: ['urchin']
                }
            });
        });

        it('uses a friendly Star Alliance card on reap', function () {
            this.player1.reap(this.exchangeOfficer);
            expect(this.player1).toBeAbleToSelect(this.haydenOswin);
            this.player1.clickCard(this.haydenOswin);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1.amber).toBe(2);
            expect(this.haydenOswin.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('uses a friendly Star Alliance card on fight', function () {
            this.player1.fightWith(this.exchangeOfficer, this.urchin);
            expect(this.player1).toBeAbleToSelect(this.haydenOswin);
            this.player1.clickCard(this.haydenOswin);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1.amber).toBe(1);
            expect(this.haydenOswin.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
