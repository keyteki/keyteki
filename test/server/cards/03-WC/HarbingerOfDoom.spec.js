describe('Harbinger of Doom', function() {
    integration(function() {
        describe('Harbinger of Doom\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'dis',
                        inPlay: ['harbinger-of-doom', 'spyyyder', 'rustgnawer']
                    },
                    player2: {
                        amber: 2,
                        inPlay: ['brain-eater', 'batdrone', 'mother'],
                        hand: ['remote-access']
                    }
                });
            });
            it('should clear the board when it\'s destroyed', function() {
                this.player1.fightWith(this.harbingerOfDoom, this.mother);
                expect(this.harbingerOfDoom.location).toBe('discard');
                expect(this.spyyyder.location).toBe('discard');
                expect(this.rustgnawer.location).toBe('discard');
                expect(this.brainEater.location).toBe('discard');
                expect(this.batdrone.location).toBe('discard');
                expect(this.mother.location).toBe('discard');
            });
        });
    });
});
