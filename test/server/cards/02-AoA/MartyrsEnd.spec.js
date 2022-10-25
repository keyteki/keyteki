describe("Martyr's End", function () {
    describe("Martyr's End's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['bulwark', 'dextre', 'barrister-joya'],
                    hand: ['martyr-s-end']
                },
                player2: {
                    inPlay: ['troll', 'chuff-ape', 'grommid']
                }
            });
        });

        it('should be able to destroy no creature and gain no amber', function () {
            this.player1.play(this.martyrSEnd);
            this.player1.clickPrompt('Done');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
        });

        it('should be able to destroy any number of friendly creature and gain amber accordingly', function () {
            this.player1.play(this.martyrSEnd);
            this.player1.clickCard(this.bulwark);
            this.player1.clickCard(this.dextre);
            this.player1.clickPrompt('Done');
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(0);
        });
    });

    describe("Martyr's End and warded creatures", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['bulwark', 'dextre', 'barrister-joya'],
                    hand: ['martyr-s-end']
                },
                player2: {
                    inPlay: ['troll', 'chuff-ape', 'grommid']
                }
            });
        });

        it('should not give aember for warded creatures', function () {
            this.bulwark.ward();
            this.player1.play(this.martyrSEnd);
            this.player1.clickCard(this.bulwark);
            this.player1.clickCard(this.dextre);
            this.player1.clickPrompt('Done');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
        });
    });

    describe("Martyr's End and Harbinger of Doom", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['bulwark', 'dextre', 'barrister-joya', 'harbinger-of-doom'],
                    hand: ['martyr-s-end']
                },
                player2: {
                    inPlay: ['troll', 'chuff-ape', 'grommid']
                }
            });
        });

        it('should not give aember for creatures destroyed by Harbinger of Doom', function () {
            this.player1.play(this.martyrSEnd);
            this.player1.clickCard(this.harbingerOfDoom);
            this.player1.clickPrompt('Done');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
        });
    });
});
