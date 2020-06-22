describe('Reassembling Automaton', function () {
    describe('destroyed ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['reassembling-automaton', 'pip-pip']
                },
                player2: {
                    amber: 1,
                    inPlay: ['nexus', 'troll', 'dodger']
                }
            });
        });

        describe('when other creatures are in play', function () {
            describe('and automaton is destroyed', function () {
                beforeEach(function () {
                    this.player1.fightWith(this.reassemblingAutomaton, this.troll);
                    this.player1.clickPrompt('right');
                });

                it('should fully heal automaton, not destroy it, exhaust it and move it to the right flank', function () {
                    expect(this.reassemblingAutomaton.tokens.damage).toBe(undefined);
                    expect(this.reassemblingAutomaton.location).toBe('play area');
                    expect(this.reassemblingAutomaton.exhausted).toBe(true);
                    expect(this.player1.player.cardsInPlay[1]).toBe(this.reassemblingAutomaton);
                });
            });
        });

        describe('when no other creatures are in play', function () {
            describe('and automaton is destroyed', function () {
                beforeEach(function () {
                    this.player1.moveCard(this.pipPip, 'discard');
                    this.player1.fightWith(this.reassemblingAutomaton, this.troll);
                });

                it('should not stop automaton from being destroyed', function () {
                    expect(this.reassemblingAutomaton.location).toBe('discard');
                });
            });
        });
    });
});
