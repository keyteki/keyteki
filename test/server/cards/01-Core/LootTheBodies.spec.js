describe('Loot the Bodies', function() {
    integration(function() {
        describe('Loot the Bodies\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'brobnar',
                        inPlay: ['troll'],
                        hand: ['loot-the-bodies', 'punch', 'hebe-the-huge']
                    },
                    player2: {
                        inPlay: ['batdrone', 'ganymede-archivist', 'doc-bookton', 'inka-the-spider']
                    }
                });
            });

            it('should gain an amber for enemy creature killed ths turn', function() {
                this.player1.play(this.lootTheBodies);
                expect(this.player1.amber).toBe(0);
                this.player1.fightWith(this.troll, this.ganymedeArchivist);
                expect(this.troll.tokens.damage).toBe(3);
                expect(this.ganymedeArchivist.location).toBe('discard');
                expect(this.player1.amber).toBe(1);
                this.player1.play(this.hebeTheHuge);
                expect(this.docBookton.tokens.damage).toBe(2);
                expect(this.batdrone.location).toBe('discard');
                expect(this.inkaTheSpider.location).toBe('discard');
                expect(this.player1.amber).toBe(3);
                this.player1.play(this.punch);
                expect(this.player1.amber).toBe(4);
                this.player1.clickCard(this.docBookton);
                expect(this.docBookton.location).toBe('discard');
                expect(this.player1.amber).toBe(5);
            });

            it('should not gain an amber for creatures killed on subsequent turns', function() {
                this.player1.play(this.lootTheBodies);
                expect(this.player1.amber).toBe(0);
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('untamed');
                this.player2.fightWith(this.inkaTheSpider, this.troll);
                expect(this.player1.amber).toBe(0);
            });

            it('should stack', function() {
                this.player1.play(this.lootTheBodies);
                expect(this.player1.amber).toBe(0);
                this.player1.moveCard(this.lootTheBodies, 'hand');
                this.player1.play(this.lootTheBodies);
                expect(this.player1.amber).toBe(0);
                this.player1.fightWith(this.troll, this.ganymedeArchivist);
                expect(this.troll.tokens.damage).toBe(3);
                expect(this.ganymedeArchivist.location).toBe('discard');
                expect(this.player1.amber).toBe(2);
            });
        });
    });
});
