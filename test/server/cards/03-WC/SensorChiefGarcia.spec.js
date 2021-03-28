describe('Sensor Chief Garcia', function () {
    describe("Sensor Chief Garcia's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'staralliance',
                    hand: ['sensor-chief-garcia']
                },
                player2: {
                    amber: 6,
                    hand: ['remote-access']
                }
            });
        });

        it('should stop a key being forged when played', function () {
            this.player1.play(this.sensorChiefGarcia);
            this.player1.endTurn();
            expect(this.player2.player.getForgedKeys()).toBe(0);
            expect(this.player2.player.amber).toBe(6);
        });
    });
    describe("Sensor Chief Garcia's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'staralliance',
                    inPlay: ['sensor-chief-garcia']
                },
                player2: {
                    amber: 6,
                    inPlay: ['dust-pixie'],
                    hand: ['remote-access']
                }
            });
        });

        it('should stop a key being forged when reaping', function () {
            this.player1.reap(this.sensorChiefGarcia);
            expect(this.player1.amber).toBe(7);
            this.player1.endTurn();
            expect(this.player2.player.getForgedKeys()).toBe(0);
            expect(this.player2.player.amber).toBe(6);
        });
        it('should stop a key being forged when fighting', function () {
            this.player1.fightWith(this.sensorChiefGarcia, this.dustPixie);
            this.player1.endTurn();
            expect(this.player2.player.getForgedKeys()).toBe(0);
            expect(this.player2.player.amber).toBe(6);
        });
    });
});
