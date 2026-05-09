describe('Soldiers to Flowers', function () {
    describe("Soldiers to Flowers' play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['soldiers-to-flowers'],
                    discard: ['hunting-witch', 'troll']
                },
                player2: {
                    discard: ['dust-pixie', 'krump']
                }
            });
        });

        it('purges each Untamed creature from each players discard pile and grants 1A per card to its owner', function () {
            this.player1.play(this.soldiersToFlowers);
            expect(this.huntingWitch.location).toBe('purged');
            expect(this.dustPixie.location).toBe('purged');
            expect(this.troll.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.player1.player.purged.length).toBe(1);
            expect(this.player2.player.purged.length).toBe(1);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Soldiers to Flowers without Untamed creatures in discards', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['soldiers-to-flowers'],
                    discard: ['troll']
                },
                player2: {
                    discard: ['krump']
                }
            });
        });

        it('purges nothing and grants no extra amber when no Untamed creatures are in discards', function () {
            this.player1.play(this.soldiersToFlowers);
            expect(this.troll.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.player1.player.purged.length).toBe(0);
            expect(this.player2.player.purged.length).toBe(0);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
