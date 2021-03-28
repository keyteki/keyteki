describe('The Feathered Shaman', function () {
    describe("The Feathered Shaman's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['the-feathered-shaman'],
                    hand: ['flaxia', 'knoxx']
                },
                player2: {
                    house: 'shadows',
                    inPlay: ['lamindra', 'redlock']
                }
            });
        });

        it('should ward no creature since there are no neighbors after reap', function () {
            expect(this.theFeatheredShaman.warded).toBe(false);
            this.player1.reap(this.theFeatheredShaman);

            expect(this.player1.amber).toBe(1);
            expect(this.theFeatheredShaman.warded).toBe(false);
        });

        it('should ward no creature since there are no neighbors after fight', function () {
            expect(this.theFeatheredShaman.warded).toBe(false);
            this.player1.fightWith(this.theFeatheredShaman, this.lamindra);

            expect(this.theFeatheredShaman.warded).toBe(false);
        });

        it('should ward right neighbor after reap', function () {
            this.player1.playCreature(this.flaxia);
            expect(this.theFeatheredShaman.warded).toBe(false);
            expect(this.flaxia.warded).toBe(false);
            this.player1.reap(this.theFeatheredShaman);

            expect(this.player1.amber).toBe(1);
            expect(this.theFeatheredShaman.warded).toBe(false);
        });

        it('should ward right neighbor after fight', function () {
            this.player1.playCreature(this.flaxia);
            expect(this.theFeatheredShaman.warded).toBe(false);
            expect(this.flaxia.warded).toBe(false);
            this.player1.fightWith(this.theFeatheredShaman, this.lamindra);

            expect(this.theFeatheredShaman.warded).toBe(false);
        });

        it('should ward both neighbors after reap', function () {
            this.player1.playCreature(this.flaxia);
            this.player1.playCreature(this.knoxx, true);
            expect(this.theFeatheredShaman.warded).toBe(false);
            expect(this.flaxia.warded).toBe(false);
            expect(this.knoxx.warded).toBe(false);
            this.player1.reap(this.theFeatheredShaman);

            expect(this.player1.amber).toBe(1);
            expect(this.theFeatheredShaman.warded).toBe(false);
            expect(this.flaxia.warded).toBe(true);
            expect(this.knoxx.warded).toBe(true);
        });

        it('should ward both neighbors after fight', function () {
            this.player1.playCreature(this.flaxia);
            this.player1.playCreature(this.knoxx, true);
            expect(this.theFeatheredShaman.warded).toBe(false);
            expect(this.flaxia.warded).toBe(false);
            expect(this.knoxx.warded).toBe(false);
            this.player1.fightWith(this.theFeatheredShaman, this.lamindra);

            expect(this.theFeatheredShaman.warded).toBe(false);
            expect(this.flaxia.warded).toBe(true);
            expect(this.knoxx.warded).toBe(true);
        });
    });
});
