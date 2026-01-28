describe('Psychic Haze', function () {
    describe("Psychic Haze's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['echofly', 'john-smyth', 'psychic-haze']
                },
                player2: {
                    hand: ['bonesaw'],
                    inPlay: ['tunk', 'gub']
                }
            });
        });

        it('enrages all enemy creatures on action', function () {
            this.player1.useAction(this.psychicHaze);
            expect(this.echofly.enraged).toBe(false);
            expect(this.johnSmyth.enraged).toBe(false);
            expect(this.tunk.enraged).toBe(true);
            expect(this.gub.enraged).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('disallows enraged enemy creatures from attacking friendly Mars creatures', function () {
            this.player1.useAction(this.psychicHaze);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.clickCard(this.gub);
            this.player2.clickPrompt('Fight with this creature');
            expect(this.player2).toBeAbleToSelect(this.echofly);
            expect(this.player2).not.toBeAbleToSelect(this.johnSmyth);
            this.player2.clickCard(this.echofly);
            expect(this.gub.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });

        it('allows unenraged enemy creatures to attack friendly Mars creatures', function () {
            this.player1.useAction(this.psychicHaze);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.fightWith(this.gub, this.echofly);
            this.player2.playCreature(this.bonesaw);
            this.player2.clickCard(this.bonesaw);
            this.player2.clickPrompt('Fight with this creature');
            expect(this.player2).toBeAbleToSelect(this.echofly);
            expect(this.player2).toBeAbleToSelect(this.johnSmyth);
            this.player2.clickCard(this.johnSmyth);
            expect(this.player2).isReadyToTakeAction();
        });

        it('does not affect friendly enraged Mars creatures', function () {
            this.johnSmyth.enrage;
            this.player1.clickCard(this.johnSmyth);
            this.player1.clickPrompt('Fight with this creature');
            expect(this.player1).toBeAbleToSelect(this.tunk);
            expect(this.player1).toBeAbleToSelect(this.gub);
            this.player1.clickCard(this.tunk);
            expect(this.johnSmyth.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
