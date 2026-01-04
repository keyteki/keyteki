describe('Embellish Imp', function () {
    describe("Embellish Imp's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['embellish-imp', 'festering-touch'],
                    inPlay: ['toad', 'charette']
                },
                player2: {
                    amber: 4,
                    inPlay: ['mighty-tiger', 'urchin', 'dust-pixie']
                }
            });
        });

        it('should steal 1 amber when an enemy creature is destroyed', function () {
            this.player1.playCreature(this.embellishImp);
            this.player1.play(this.festeringTouch);
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.mightyTiger);
            this.player1.clickPrompt('Done');
            expect(this.player2.amber).toBe(3);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should steal 2 amber when 2 enemy creatures are destroyed', function () {
            this.player1.playCreature(this.embellishImp);
            this.player1.play(this.festeringTouch);
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.dustPixie); // order of steal
            expect(this.player2.amber).toBe(2);
            expect(this.player1.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not steal amber when a friendly creature is destroyed', function () {
            this.player1.playCreature(this.embellishImp);
            this.player1.play(this.festeringTouch);
            this.player1.clickCard(this.toad);
            this.player1.clickCard(this.mightyTiger);
            this.player1.clickPrompt('Done');
            expect(this.player2.amber).toBe(4);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should destroy the most powerful friendly creature when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.embellishImp);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.reap(this.urchin);
            expect(this.player2).toBeAbleToSelect(this.mightyTiger);
            expect(this.player2).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player2).not.toBeAbleToSelect(this.urchin);
            expect(this.player2).not.toBeAbleToSelect(this.toad);
            expect(this.player2).not.toBeAbleToSelect(this.charette);
            this.player2.clickCard(this.mightyTiger);
            expect(this.mightyTiger.location).toBe('discard');
            expect(this.dustPixie.location).toBe('play area');
            expect(this.urchin.location).toBe('play area');
            expect(this.embellishImp.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
