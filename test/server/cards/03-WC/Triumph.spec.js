describe('Triumph', function () {
    describe("Triumph's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 4,
                    inPlay: ['lamindra', 'redlock', 'urchin', 'troll', 'krump'],
                    hand: ['triumph', 'spartasaur', 'saurus-rex']
                },
                player2: {
                    amber: 1,
                    inPlay: ['shooler']
                }
            });
        });

        it('should do nothing when there are enemy creatures', function () {
            this.player1.play(this.triumph);
            expect(this.lamindra.amber).toBe(0);
            expect(this.redlock.amber).toBe(0);
            expect(this.urchin.amber).toBe(0);
            expect(this.troll.amber).toBe(0);
            expect(this.krump.amber).toBe(0);
            expect(this.shooler.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.player.getForgedKeys()).toBe(0);
            expect(this.player1.amber).toBe(5);
        });

        it('should exalt friendly creatures, but not forge a key when there are less than 6 friendly creatures', function () {
            this.player2.moveCard(this.shooler, 'discard');
            this.player1.play(this.triumph);
            expect(this.lamindra.amber).toBe(1);
            expect(this.redlock.amber).toBe(1);
            expect(this.urchin.amber).toBe(1);
            expect(this.troll.amber).toBe(1);
            expect(this.krump.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.player.getForgedKeys()).toBe(0);
            expect(this.player1.amber).toBe(5);
        });

        it('should exalt friendly creatures and forge when there are 6 friendly creatures', function () {
            this.player2.moveCard(this.shooler, 'discard');
            this.player1.play(this.spartasaur);
            this.player1.play(this.triumph);
            expect(this.spartasaur.amber).toBe(1);
            expect(this.lamindra.amber).toBe(1);
            expect(this.redlock.amber).toBe(1);
            expect(this.urchin.amber).toBe(1);
            expect(this.troll.amber).toBe(1);
            expect(this.krump.amber).toBe(1);
            this.player1.forgeKey('Red');
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.player1.amber).toBe(5);
        });

        it('should exalt friendly creatures and forge when there are more than 6 friendly creatures', function () {
            this.player2.moveCard(this.shooler, 'discard');
            this.player1.play(this.spartasaur);
            this.player1.play(this.saurusRex);
            this.player1.play(this.triumph);
            expect(this.spartasaur.amber).toBe(1);
            expect(this.saurusRex.amber).toBe(1);
            expect(this.lamindra.amber).toBe(1);
            expect(this.redlock.amber).toBe(1);
            expect(this.urchin.amber).toBe(1);
            expect(this.troll.amber).toBe(1);
            expect(this.krump.amber).toBe(1);
            this.player1.forgeKey('Red');
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.player1.amber).toBe(5);
        });
    });
});
