describe('Grave Pixie', function () {
    describe("Grave Pixie's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['the-common-cold', 'fertility-chant'],
                    inPlay: ['grave-pixie'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    inPlay: ['troll']
                }
            });
            this.player1.chains = 36;
        });

        it('does not archive when not haunted', function () {
            this.player1.play(this.theCommonCold);
            expect(this.gravePixie.location).toBe('discard');
        });

        it('does archive when haunted', function () {
            this.player1.play(this.fertilityChant);
            this.player1.play(this.theCommonCold);
            expect(this.gravePixie.location).toBe('archives');
        });

        it('does archive when haunted and opponent kills it', function () {
            this.player1.play(this.fertilityChant);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.gravePixie);
            expect(this.gravePixie.location).toBe('archives');
            expect(this.player1.player.archives).toContain(this.gravePixie);
        });
    });
});
