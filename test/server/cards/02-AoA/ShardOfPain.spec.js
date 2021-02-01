describe('Shard of Pain', function () {
    describe("Shard of Pain's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['dust-imp'],
                    inPlay: [
                        'shooler',
                        'shard-of-pain',
                        'shard-of-greed',
                        'seeker-needle',
                        'shard-of-hope'
                    ]
                },
                player2: {
                    hand: ['remote-access'],
                    inPlay: ['dextre', 'mother', 'archimedes', 'shard-of-knowledge']
                }
            });
        });

        it('should deal 3 damages to enemy creatures', function () {
            this.player1.useAction(this.shardOfPain);
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.archimedes);
            expect(this.player1).not.toBeAbleToSelect(this.shooler);
            this.player1.clickCard(this.mother);
            this.player1.clickCard(this.mother);
            this.player1.clickCard(this.dextre);

            expect(this.mother.tokens.damage).toBe(2);
            expect(this.dextre.tokens.damage).toBe(1);
        });

        describe('when there are no enemy creatures in play', function () {
            beforeEach(function () {
                this.player2.moveCard(this.dextre, 'discard');
                this.player2.moveCard(this.mother, 'discard');
                this.player2.moveCard(this.archimedes, 'discard');
            });

            it('should not prompt', function () {
                this.player1.useAction(this.shardOfPain);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });
    });
});
