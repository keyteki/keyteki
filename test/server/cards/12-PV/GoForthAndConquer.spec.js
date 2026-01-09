describe('Go Forth and Conquer', function () {
    describe('when activated', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    prophecies: [
                        'go-forth-and-conquer',
                        'fate-laughs-at-your-plans',
                        'bad-omen',
                        'expect-the-unexpected'
                    ],
                    hand: ['parasitic-arachnoid'],
                    inPlay: ['mushroom-man', 'dew-faerie', 'briar-grubbling']
                },
                player2: {
                    amber: 5,
                    hand: ['spoo-key-charge'],
                    inPlay: ['hunting-witch', 'dust-pixie', 'ancient-bear']
                }
            });
        });

        it('should fulfill when opponent uses a creature to fight', function () {
            this.player1.activateProphecy(this.goForthAndConquer, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.huntingWitch, this.mushroomMan);
            expect(this.player2).toBeAbleToSelect(this.dustPixie);
            this.player2.clickCard(this.dustPixie);
            expect(this.player2.amber).toBe(3);
            expect(this.dustPixie.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should fulfill when opponent uses a creature to fight and the fight ends early to assault', function () {
            this.player1.activateProphecy(this.goForthAndConquer, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            // Ancient Bear has assault 2, which damages through Dew Faerie’s
            // elusive and kills it.
            this.player2.fightWith(this.ancientBear, this.dewFaerie);
            expect(this.dewFaerie.location).toBe('discard');
            expect(this.player2).toBeAbleToSelect(this.dustPixie);
            this.player2.clickCard(this.dustPixie);
            expect(this.player2.amber).toBe(3);
            expect(this.dustPixie.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should fulfill when opponent uses a creature to fight and the fight ends early to hazardous', function () {
            this.player1.activateProphecy(this.goForthAndConquer, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            // Briar Grubbling has hazardous 5, Hunting Witch will die on impact.
            this.player2.fightWith(this.huntingWitch, this.briarGrubbling);
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.player2).toBeAbleToSelect(this.dustPixie);
            this.player2.clickCard(this.dustPixie);
            expect(this.player2.amber).toBe(3);
            expect(this.dustPixie.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not fulfill when you use a creature to fight', function () {
            this.player1.activateProphecy(this.goForthAndConquer, this.parasiticArachnoid);
            this.player1.fightWith(this.mushroomMan, this.huntingWitch);
            expect(this.goForthAndConquer.activeProphecy).toBe(true);
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not fulfill when opponent uses a creature to reap', function () {
            this.player1.activateProphecy(this.goForthAndConquer, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.huntingWitch);
            expect(this.goForthAndConquer.activeProphecy).toBe(true);
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
