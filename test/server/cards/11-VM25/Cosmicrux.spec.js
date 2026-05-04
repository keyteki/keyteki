describe('Cosmicrux', function () {
    describe("Cosmicrux's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['cosmicrux', 'troll']
                },
                player2: {
                    inPlay: ['charette']
                }
            });
        });

        it('should deal 1 damage to a creature when it readies', function () {
            this.troll.exhaust();
            this.player1.endTurn();
            expect(this.troll.damage).toBe(1);
            expect(this.cosmicrux.damage).toBe(0);
            expect(this.charette.damage).toBe(0);
        });

        it('should deal 1 damage to opponent creature when it readies', function () {
            this.charette.exhaust();
            this.player1.endTurn();
            this.player2.clickPrompt('Dis');
            this.player2.endTurn();
            expect(this.troll.damage).toBe(0);
            expect(this.cosmicrux.damage).toBe(0);
            expect(this.charette.damage).toBe(1);
        });

        it('should deal 1 damage to multiple creatures when they ready', function () {
            this.troll.exhaust();
            this.cosmicrux.exhaust();
            this.player1.endTurn();
            this.player1.clickCard(this.cosmicrux);
            expect(this.troll.damage).toBe(1);
            expect(this.cosmicrux.damage).toBe(1);
            expect(this.charette.damage).toBe(0);
        });
    });

    describe('Cosmicrux deals all of its ready damage simultaneously', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['cosmicrux', 'urchin', 'old-egad', 'umbra']
                },
                player2: {}
            });
            this.oldEgad.armorUsed = this.oldEgad.armor;
        });

        it('destroys Old Egad and urchin simultaneously', function () {
            this.urchin.exhaust();
            this.oldEgad.exhaust();
            this.umbra.exhaust();
            this.player1.endTurn();
            expect(this.urchin.location).toBe('discard');
            expect(this.oldEgad.location).toBe('discard');
            expect(this.umbra.location).toBe('play area');
            expect(this.umbra.damage).toBe(1);
            expect(this.umbra.warded).toBe(true);
        });
    });
});
