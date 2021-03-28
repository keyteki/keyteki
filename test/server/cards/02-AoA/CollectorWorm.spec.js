describe('Collector Worm', function () {
    describe("Collector Worm's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'mars',
                    hand: [],
                    inPlay: ['collector-worm']
                },
                player2: {
                    amber: 2,
                    hand: [],
                    inPlay: ['bad-penny', 'helper-bot', 'mother', 'troll']
                }
            });
        });

        it('should archive the defender, if both survived the fight.', function () {
            expect(this.player1.archives.length).toBe(0);
            expect(this.player2.archives.length).toBe(0);

            this.player1.fightWith(this.collectorWorm, this.mother);

            expect(this.player1.archives.length).toBe(1);
            expect(this.player2.archives.length).toBe(0);

            expect(this.collectorWorm.hasToken('damage')).toBe(false);

            expect(this.player2.player.cardsInPlay).not.toContain(this.mother);
            expect(this.mother.location).toBe('archives');
        });

        it('should not archive the defender, if the defender was destroyed.', function () {
            expect(this.player1.archives.length).toBe(0);
            expect(this.player2.archives.length).toBe(0);

            this.player1.fightWith(this.collectorWorm, this.helperBot);

            expect(this.player1.archives.length).toBe(0);
            expect(this.player2.archives.length).toBe(0);

            expect(this.collectorWorm.hasToken('damage')).toBe(false);

            expect(this.player2.player.cardsInPlay).not.toContain(this.helperBot);
            expect(this.helperBot.location).toBe('discard');
        });

        it('should not archive the defender, if the Collector Worm was destroyed.', function () {
            expect(this.player1.archives.length).toBe(0);
            expect(this.player2.archives.length).toBe(0);

            this.player1.fightWith(this.collectorWorm, this.troll);

            expect(this.player1.archives.length).toBe(0);
            expect(this.player2.archives.length).toBe(0);

            expect(this.collectorWorm.location).toBe('discard');

            expect(this.troll.hasToken('damage')).toBe(true);
            expect(this.troll.location).not.toBe('archives');
        });
    });
});
