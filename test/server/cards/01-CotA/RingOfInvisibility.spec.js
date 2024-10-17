describe('Ring of Invisibility', function () {
    describe("Ring of Invisibility's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['silvertooth'],
                    hand: ['ring-of-invisibility']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should give the attached creature Skirmish', function () {
            this.player1.playUpgrade(this.ringOfInvisibility, this.silvertooth);
            expect(this.silvertooth.getKeywordValue('skirmish')).toBe(1);
            expect(this.silvertooth.getKeywordValue('elusive')).toBe(1);
            this.player1.fightWith(this.silvertooth, this.troll);
            expect(this.silvertooth.location).toBe('play area');
            expect(this.troll.tokens.damage).toBe(2);
        });

        it('should give the attached creature Elusive', function () {
            this.player1.playUpgrade(this.ringOfInvisibility, this.silvertooth);
            this.player1.fightWith(this.silvertooth, this.troll);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.silvertooth);
            expect(this.silvertooth.location).toBe('play area');
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.troll.exhausted).toBe(true);
        });
    });
});
