describe('Immortal Greking', function () {
    describe("Immortal Greking's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['immortal-greking', 'a-strong-feeling'],
                    inPlay: ['flaxia', 'dust-pixie', 'echofly'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    inPlay: ['thing-from-the-deep', 'batdrone']
                }
            });
            this.player1.chains = 36;
        });

        it('takes control of enemy creature on play and places it anywhere in battleline', function () {
            this.player1.playCreature(this.immortalGreking);
            expect(this.player1).toBeAbleToSelect(this.thingFromTheDeep);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.echofly);
            expect(this.player1).not.toBeAbleToSelect(this.immortalGreking);
            this.player1.clickCard(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.thingFromTheDeep);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.echofly);
            expect(this.player1).toBeAbleToSelect(this.immortalGreking);
            this.player1.clickCard(this.echofly);
            this.player1.clickPrompt('Left');
            expect(this.echofly.leftNeighbor()).toBe(this.batdrone);
            expect(this.dustPixie.rightNeighbor()).toBe(this.batdrone);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('makes the stolen creature the same house as Greking', function () {
            this.player1.playCreature(this.immortalGreking);
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.echofly);
            this.player1.clickPrompt('Left');
            this.player1.reap(this.batdrone);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        describe('after play', function () {
            beforeEach(function () {
                this.player1.playCreature(this.immortalGreking);
                this.player1.clickCard(this.batdrone);
                this.player1.clickCard(this.echofly);
                this.player1.clickPrompt('Left');
                this.player1.endTurn();
                this.player2.clickPrompt('untamed');
                this.player2.endTurn();
                this.player1.clickPrompt('geistoid');
            });

            it('stolen creature loses house on destroy', function () {
                this.player1.fightWith(this.immortalGreking, this.thingFromTheDeep);
                this.player1.clickCard(this.batdrone);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });

            it('does not archive on destroy if not haunted', function () {
                this.player1.fightWith(this.immortalGreking, this.thingFromTheDeep);
                expect(this.immortalGreking.location).toBe('discard');
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });

            it('archives on destroy if haunted', function () {
                this.player1.play(this.aStrongFeeling);
                this.player1.fightWith(this.immortalGreking, this.thingFromTheDeep);
                expect(this.immortalGreking.location).toBe('archives');
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });
    });
});
