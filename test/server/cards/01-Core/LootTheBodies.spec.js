describe('Loot the Bodies', function () {
    describe("Loot the Bodies's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll'],
                    hand: [
                        'loot-the-bodies',
                        'loot-the-bodies',
                        'punch',
                        'hebe-the-huge',
                        'coward-s-end'
                    ]
                },
                player2: {
                    inPlay: ['batdrone', 'ganymede-archivist', 'doc-bookton', 'inka-the-spider']
                }
            });
        });

        it('should gain an amber for enemy creature killed ths turn', function () {
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
            this.player1.clickPrompt('Loot the Bodies');
            this.player1.clickCard(this.batdrone);
            expect(this.player1.amber).toBe(3);
            this.player1.play(this.punch);
            expect(this.player1.amber).toBe(4);
            this.player1.clickCard(this.docBookton);
            expect(this.docBookton.location).toBe('discard');
            expect(this.player1.amber).toBe(5);
        });

        it('should not gain an amber for creatures killed on subsequent turns', function () {
            this.player1.play(this.lootTheBodies);
            expect(this.player1.amber).toBe(0);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.inkaTheSpider, this.troll);
            expect(this.player1.amber).toBe(0);
        });

        it('should stack', function () {
            this.lootTheBodies2 = this.player1.player.hand[1];
            this.player1.play(this.lootTheBodies);
            expect(this.player1.amber).toBe(0);
            this.player1.play(this.lootTheBodies2);
            expect(this.player1.amber).toBe(0);
            this.player1.fightWith(this.troll, this.ganymedeArchivist);
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.ganymedeArchivist.location).toBe('discard');
            this.player1.clickPrompt('Loot the Bodies');
            expect(this.player1.amber).toBe(2);
        });

        it("should work with Coward's end", function () {
            this.player1.play(this.lootTheBodies);
            this.player1.play(this.cowardSEnd);
            this.player1.clickPrompt('Loot the Bodies');
            this.player1.clickCard(this.batdrone);
            this.player1.clickPrompt('Loot the Bodies');
            this.player1.clickCard(this.ganymedeArchivist);
            this.player1.clickPrompt('Loot the Bodies');
            this.player1.clickCard(this.inkaTheSpider);
            expect(this.player1.amber).toBe(4);
        });
    });
});
