describe('Parasitic Arachnoid', function () {
    describe("Parasitic Arachnoid's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['parasitic-arachnoid', 'draining-touch'],
                    inPlay: ['charette'],
                    prophecies: [
                        'expect-the-unexpected',
                        'forge-ahead-with-confidence',
                        'fate-laughs-at-your-plans',
                        'bad-omen'
                    ]
                },
                player2: {
                    amber: 2,
                    hand: ['spoo-key-charge'],
                    inPlay: ['troll', 'krump']
                }
            });
        });

        it('should cause enemy creature to capture 1 from its own side when destroyed on your turn', function () {
            this.player1.playCreature(this.parasiticArachnoid);
            this.player1.play(this.drainingTouch);
            this.player1.clickCard(this.parasiticArachnoid);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.charette);
            this.player1.clickCard(this.troll);
            expect(this.troll.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });

        it('should cause enemy creature to capture 1 from its own side when destroyed on opponent turn', function () {
            this.player1.playCreature(this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.parasiticArachnoid);
            expect(this.player2).toBeAbleToSelect(this.troll);
            expect(this.player2).toBeAbleToSelect(this.krump);
            expect(this.player2).not.toBeAbleToSelect(this.charette);
            this.player2.clickCard(this.troll);
            expect(this.troll.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });

        it('should cause friendly creature to capture 2 from your side when fate is activated', function () {
            this.player1.activateProphecy(this.expectTheUnexpected, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.spooKeyCharge);
            expect(this.player2).toBeAbleToSelect(this.troll);
            expect(this.player2).toBeAbleToSelect(this.krump);
            expect(this.player2).not.toBeAbleToSelect(this.charette);
            this.player2.clickCard(this.troll);
            expect(this.troll.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
            expect(this.parasiticArachnoid.location).toBe('discard');
        });
    });
});
