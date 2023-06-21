describe('Blorb', function () {
    describe("Blorb's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    token: 'blorb',
                    house: 'mars',
                    inPlay: ['blorb:toad'],
                    discard: ['blorb-hive']
                },
                player2: {
                    inPlay: ['umbra']
                }
            });

            this.toad = this.blorb;
        });

        it('should not be able to reap', function () {
            this.player1.clickCard(this.blorb);
            expect(this.player1).not.toHavePrompt('Reap with this Creature');
        });

        it('bring back Blorb Hive when destroyed', function () {
            this.player1.fightWith(this.blorb, this.umbra);
            this.player1.clickCard(this.blorbHive);
            expect(this.blorbHive.location).toBe('hand');
            expect(this.toad.location).toBe('discard');
        });
    });
});
