describe('Hoarding the Goods', function () {
    describe("Hoarding the Goods's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    amber: 0,
                    hand: ['hoarding-the-goods'],
                    inPlay: ['caspart', 'noxious-ionox', 'sparkscheme']
                },
                player2: {
                    amber: 5
                }
            });
        });

        it('captures 1 per friendly exhausted creature', function () {
            this.caspart.exhaust();
            this.noxiousIonox.exhaust();
            this.player1.play(this.hoardingTheGoods);
            expect(this.caspart.amber).toBe(1);
            expect(this.noxiousIonox.amber).toBe(1);
            expect(this.sparkscheme.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing when no creatures exhausted', function () {
            this.player1.play(this.hoardingTheGoods);
            expect(this.caspart.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Hoarding the Goods with limited opponent amber', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    amber: 0,
                    hand: ['hoarding-the-goods'],
                    inPlay: ['caspart', 'noxious-ionox', 'sparkscheme']
                },
                player2: {
                    amber: 1
                }
            });
        });

        it('does nothing when opponent has no amber', function () {
            this.player2.player.amber = 0;
            this.caspart.exhaust();
            this.noxiousIonox.exhaust();
            this.player1.play(this.hoardingTheGoods);
            expect(this.caspart.amber).toBe(0);
            expect(this.noxiousIonox.amber).toBe(0);
            const logs = this.getChatLogs(10);
            expect(logs).toContain('player1 plays Hoarding the Goods');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
