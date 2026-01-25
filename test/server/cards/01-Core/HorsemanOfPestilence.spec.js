describe('Horseman of Pestilence', function () {
    describe("Horseman of Pestilence's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: [
                        'sequis',
                        'ember-imp',
                        'batdrone',
                        'gorm-of-omm',
                        'pit-demon',
                        'horseman-of-pestilence'
                    ],
                    hand: ['horseman-of-pestilence']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll', 'gauntlet-of-command']
                }
            });
            this.horsemanOfPestilence1 = this.player1.findCardByName(
                'horseman-of-pestilence',
                'hand'
            );
            this.horsemanOfPestilence2 = this.player1.findCardByName(
                'horseman-of-pestilence',
                'play area'
            );
        });

        it('should deal 1 damage to all non-horseman creatures when played', function () {
            this.player1.play(this.horsemanOfPestilence1);
            expect(this.troll.damage).toBe(1);
            expect(this.emberImp.damage).toBe(1);
            expect(this.batdrone.damage).toBe(1);
            expect(this.pitDemon.damage).toBe(1);
            expect(this.horsemanOfPestilence1.damage).toBe(0);
            expect(this.horsemanOfPestilence2.damage).toBe(0);
        });

        it('should deal 1 damage to all non-horseman creatures when reaping', function () {
            this.player1.reap(this.horsemanOfPestilence2);
            expect(this.troll.damage).toBe(1);
            expect(this.emberImp.damage).toBe(1);
            expect(this.batdrone.damage).toBe(1);
            expect(this.pitDemon.damage).toBe(1);
            expect(this.horsemanOfPestilence2.damage).toBe(0);
        });
    });
});
