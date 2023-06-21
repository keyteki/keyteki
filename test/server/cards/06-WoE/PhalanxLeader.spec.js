describe('Phalanx Leader', function () {
    describe("Phalanx Leader's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    token: 'senator',
                    inPlay: ['daughter'],
                    hand: ['phalanx-leader', 'questor-jarta', 'brutodon-auxiliary']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra']
                }
            });

            this.deckCard = this.player1.deck[0];
        });

        it('when played on left flank, should make a token creature and place it on its left side', function () {
            this.player1.play(this.phalanxLeader, true);
            let senator = this.player1.inPlay[0];
            expect(senator.name).toBe('Senator');
            expect(senator).toBe(this.deckCard);
            expect(senator.exhausted).toBe(true);
            expect(this.player1.inPlay[1]).toBe(this.phalanxLeader);
            expect(this.player1.inPlay[2]).toBe(this.daughter);
            this.player1.endTurn();
        });

        it('when played on right flank, should make a token creature and place it on its left side', function () {
            this.player1.play(this.phalanxLeader, false);
            let senator = this.player1.inPlay[1];
            expect(senator.name).toBe('Senator');
            expect(senator).toBe(this.deckCard);
            expect(senator.exhausted).toBe(true);
            expect(this.player1.inPlay[2]).toBe(this.phalanxLeader);
            expect(this.player1.inPlay[0]).toBe(this.daughter);
            this.player1.endTurn();
        });

        it('should modify power of all creatures to the left', function () {
            this.player1.play(this.phalanxLeader, false);
            let senator = this.player1.inPlay[1];
            this.player1.playCreature(this.brutodonAuxiliary);
            this.player1.endTurn();

            this.player2.clickPrompt('shadows');
            this.player2.endTurn();

            this.player1.clickPrompt('saurian');
            expect(this.daughter.power).toBe(2);
            expect(senator.power).toBe(2);
            expect(this.brutodonAuxiliary.power).toBe(6);
            this.player1.reap(this.phalanxLeader);
            expect(this.daughter.power).toBe(4);
            expect(senator.power).toBe(4);
            expect(this.phalanxLeader.power).toBe(4);
            expect(this.brutodonAuxiliary.power).toBe(6);

            // Should affect new cards too.
            this.player1.playCreature(this.questorJarta, true);
            expect(this.questorJarta.power).toBe(5);

            // Doesn't affect enemy creatures.
            expect(this.lamindra.power).toBe(1);

            // Wears off.
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            expect(this.daughter.power).toBe(2);
            expect(senator.power).toBe(2);
            expect(this.questorJarta.power).toBe(3);
        });

        it('should modify power on a fight as well', function () {
            this.player1.play(this.phalanxLeader, false);
            let senator = this.player1.inPlay[1];
            this.player1.playCreature(this.brutodonAuxiliary);
            this.player1.endTurn();

            this.player2.clickPrompt('shadows');
            this.player2.endTurn();

            this.player1.clickPrompt('saurian');
            expect(this.daughter.power).toBe(2);
            expect(senator.power).toBe(2);
            expect(this.brutodonAuxiliary.power).toBe(6);
            this.player1.fightWith(this.phalanxLeader, this.lamindra);
            expect(this.daughter.power).toBe(4);
            expect(senator.power).toBe(4);
            expect(this.phalanxLeader.power).toBe(4);
            expect(this.brutodonAuxiliary.power).toBe(6);
        });
    });
});
