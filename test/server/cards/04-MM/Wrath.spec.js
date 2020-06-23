describe('Wrath', function () {
    describe("Wrath's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['envy', 'pride', 'wrath', 'lamindra', 'gub']
                },
                player2: {
                    inPlay: [
                        'desire',
                        'dust-imp',
                        'shooler',
                        'troll',
                        'ganger-chieftain',
                        'culf-the-quiet'
                    ]
                }
            });
        });

        it('should enrage three enemy creatures', function () {
            this.player1.fightWith(this.wrath, this.culfTheQuiet);
            this.player1.clickCard(this.desire);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.culfTheQuiet);
            this.player1.clickPrompt('Done');
            expect(this.desire.tokens.enrage).toBe(1);
            expect(this.troll.tokens.enrage).toBe(1);
            expect(this.culfTheQuiet.tokens.enrage).toBe(1);
        });
    });
});
