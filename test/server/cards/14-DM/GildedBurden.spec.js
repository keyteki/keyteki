describe('Gilded Burden', function () {
    describe("Gilded Burden's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    hand: ['gilded-burden']
                },
                player2: {
                    amber: 5,
                    inPlay: ['troll', 'bumpsy', 'urchin']
                }
            });
        });

        it('captures 2 from own side per opp forged key', function () {
            this.player1.player.keys.red = true;
            this.player1.player.keys.blue = true;
            this.player2.player.keys.red = true;
            this.player2.player.keys.blue = true;
            this.player1.play(this.gildedBurden);
            expect(this.player1).toHavePrompt('Choose an enemy creature to capture 2 amber on');
            expect(this.player1).not.toBeAbleToSelect(this.gildedBurden);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.bumpsy);
            expect(this.troll.amber).toBe(2);
            expect(this.bumpsy.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            const logs = this.getChatLogs(10);
            expect(logs).toContain('player1 uses Gilded Burden to have Troll capture 2 amber');
            expect(logs).toContain('player1 uses Gilded Burden to have Bumpsy capture 2 amber');
            expect(this.player1).isReadyToTakeAction();
        });

        it('logs the actual amount captured when there is not enough amber', function () {
            this.player2.amber = 3;
            this.player2.player.keys.red = true;
            this.player2.player.keys.blue = true;
            this.player1.play(this.gildedBurden);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.bumpsy);
            expect(this.troll.amber).toBe(2);
            expect(this.bumpsy.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            const logs = this.getChatLogs(10);
            expect(logs).toContain('player1 uses Gilded Burden to have Troll capture 2 amber');
            expect(logs).toContain('player1 uses Gilded Burden to have Bumpsy capture 1 amber');
            expect(this.player1).isReadyToTakeAction();
        });

        it('can choose the same creature more than once', function () {
            this.player2.player.keys.red = true;
            this.player2.player.keys.blue = true;
            this.player1.play(this.gildedBurden);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.amber).toBe(4);
            expect(this.player2.amber).toBe(1);
            const logs = this.getChatLogs(10);
            expect(logs).toContain('player1 uses Gilded Burden to have Troll capture 4 amber');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing when opp has 0 forged keys', function () {
            this.player1.play(this.gildedBurden);
            expect(this.troll.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
