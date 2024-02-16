describe('Curse Of Cowardice', function () {
    describe("Curse Of Cowardice's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    hand: ['curse-of-cowardice'],
                    inPlay: ['john-smyth', 'thing-from-the-deep']
                },
                player2: {
                    amber: 5,
                    inPlay: ['troll']
                }
            });
        });

        describe('when played', function () {
            beforeEach(function () {
                this.player1.play(this.curseOfCowardice);
                this.player1.endTurn();
                this.player2.clickPrompt('brobnar');
            });

            it('should enter play under opponents control', function () {
                expect(this.curseOfCowardice.location).toBe('play area');
                expect(this.player1.player.cardsInPlay).not.toContain(this.curseOfCowardice);
                expect(this.player2.player.cardsInPlay).toContain(this.curseOfCowardice);
            });

            describe("at the end of owner's turn", function () {
                it('should lose opponent amber if no fights', function () {
                    this.player2.endTurn();
                    expect(this.player2.amber).toBe(3);
                    expect(this.player1.amber).toBe(1);
                });

                it('should not lose opponent amber if a fight happened', function () {
                    this.player2.fightWith(this.troll, this.johnSmyth);
                    this.player2.endTurn();
                    expect(this.player2.amber).toBe(5);
                    expect(this.player1.amber).toBe(1);
                });

                it('should reset after a turn', function () {
                    this.player2.fightWith(this.troll, this.johnSmyth);
                    this.player2.endTurn();
                    this.player1.clickPrompt('mars');
                    this.player1.endTurn();
                    this.player2.clickPrompt('brobnar');
                    this.player2.endTurn();
                    expect(this.player2.amber).toBe(3);
                    expect(this.player1.amber).toBe(1);
                });

                it('should be destroyed when no friendly creatures at end of turn', function () {
                    this.player2.fightWith(this.troll, this.thingFromTheDeep);
                    expect(this.curseOfCowardice.location).toBe('play area');
                    this.player2.endTurn();
                    expect(this.curseOfCowardice.location).toBe('discard');
                    expect(this.player2.amber).toBe(5);
                    expect(this.player1.amber).toBe(1);
                });

                it('should be destroyed when no friendly creatures after amber loss', function () {
                    this.player2.moveCard(this.troll, 'discard');
                    expect(this.curseOfCowardice.location).toBe('play area');
                    this.player2.endTurn();
                    expect(this.curseOfCowardice.location).toBe('discard');
                    expect(this.player2.amber).toBe(3);
                    expect(this.player1.amber).toBe(1);
                });
            });
        });
    });
});
