describe('Deep Blue Bryn', function () {
    describe('Deep Blue Bryn after fight when no blue key forged', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['deep-blue-bryn']
                },
                player2: {
                    amber: 3,
                    inPlay: ['bad-penny']
                }
            });
        });

        it('steals 1 and does not ward', function () {
            this.player1.fightWith(this.deepBlueBryn, this.badPenny);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.deepBlueBryn.warded).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Deep Blue Bryn after fight when player has forged blue key', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['deep-blue-bryn']
                },
                player2: {
                    amber: 3,
                    inPlay: ['bad-penny']
                }
            });
            this.player1.player.keys.blue = true;
        });

        it('steals 1 and wards Deep Blue Bryn', function () {
            this.player1.fightWith(this.deepBlueBryn, this.badPenny);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.deepBlueBryn.warded).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Deep Blue Bryn after fight when opponent has forged blue key', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['deep-blue-bryn']
                },
                player2: {
                    amber: 3,
                    inPlay: ['bad-penny']
                }
            });
            this.player2.player.keys.blue = true;
        });

        it('steals 1 and wards Deep Blue Bryn', function () {
            this.player1.fightWith(this.deepBlueBryn, this.badPenny);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.deepBlueBryn.warded).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Deep Blue Bryn after fight when opponent has no amber and blue key is forged', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['deep-blue-bryn']
                },
                player2: {
                    amber: 0,
                    inPlay: ['bad-penny']
                }
            });
            this.player1.player.keys.blue = true;
        });

        it('wards Deep Blue Bryn even though steal had no effect', function () {
            this.player1.fightWith(this.deepBlueBryn, this.badPenny);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.deepBlueBryn.warded).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
