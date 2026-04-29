describe('Ilxid Avenger', function () {
    describe("Ilxid Avenger's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'mars',
                    hand: ['ilxid-avenger'],
                    inPlay: ['echofly', 'john-smyth'],
                    discard: ['shadys', 'key-abduction', 'purse-a-phone', 'ironyx-rebel']
                },
                player2: {
                    amber: 1,
                    inPlay: ['dust-pixie']
                }
            });
        });

        it('gets power counters on play', function () {
            this.player1.playCreature(this.ilxidAvenger);
            expect(this.ilxidAvenger.power).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it('gets power counters on fight', function () {
            this.player1.playCreature(this.ilxidAvenger);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('mars');
            this.player1.fightWith(this.ilxidAvenger, this.dustPixie);
            expect(this.ilxidAvenger.power).toBe(7);
            expect(this.player1).isReadyToTakeAction();
        });

        it('gives out power counters on scrap', function () {
            this.player1.scrap(this.ilxidAvenger);
            expect(this.player1).toBeAbleToSelect(this.echofly);
            expect(this.player1).toBeAbleToSelect(this.johnSmyth);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.echofly);
            this.player1.clickCard(this.johnSmyth);
            this.player1.clickCard(this.echofly); // Ilxid itself counts
            expect(this.echofly.power).toBe(4);
            expect(this.johnSmyth.power).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
