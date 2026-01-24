describe('Green Aeronaut', function () {
    describe("Green Aeronaut's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['nautilixian', 'green-aeronaut'],
                    hand: ['nautilixian']
                },
                player2: {
                    amber: 3,
                    inPlay: ['toad', 'umbra', 'bumpsy', 'hunting-witch']
                }
            });
        });

        it('should cause the nautilixian to gain splash-attack', function () {
            this.player1.useAction(this.greenAeronaut);
            this.player1.clickCard(this.nautilixian);
            this.player1.fightWith(this.nautilixian, this.umbra);
            expect(this.umbra.location).toBe('discard');
            expect(this.toad.location).toBe('discard');
            expect(this.bumpsy.damage).toBe(3);
        });

        it('should let you choose the nautilixian', function () {
            this.nautilixian2 = this.player1.hand[0];
            this.player1.playCreature(this.nautilixian2, true);
            this.player1.useAction(this.greenAeronaut);
            this.player1.clickCard(this.nautilixian);
            this.player1.fightWith(this.nautilixian, this.umbra);
            expect(this.umbra.location).toBe('discard');
            expect(this.toad.location).toBe('discard');
            expect(this.bumpsy.damage).toBe(3);
        });

        it('should cause the nautilixian to lose the keyword the next turn', function () {
            this.player1.useAction(this.greenAeronaut);
            this.player1.clickCard(this.nautilixian);
            this.player1.fightWith(this.nautilixian, this.umbra);
            expect(this.umbra.location).toBe('discard');
            expect(this.toad.location).toBe('discard');
            expect(this.bumpsy.damage).toBe(3);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('mars');
            this.player1.reap(this.greenAeronaut);
            this.player1.fightWith(this.nautilixian, this.huntingWitch);
            expect(this.bumpsy.damage).toBe(3);
        });
    });
});
