describe('Instrument of Silence', function () {
    describe("Instrument of Silence's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 0,
                    inPlay: ['dust-pixie'],
                    hand: ['instrument-of-silence']
                },
                player2: {
                    amber: 1,
                    inPlay: ['nexus', 'yantzee-gang']
                }
            });
        });

        it('should gain an amber when it fights an elusive creature', function () {
            this.player1.playUpgrade(this.instrumentOfSilence, this.dustPixie);
            this.player1.fightWith(this.dustPixie, this.nexus);
            expect(this.dustPixie.location).toBe('play area');
            expect(this.player1.amber).toBe(1);
        });
        it('should gain skirmish from the upgrade', function () {
            this.player1.playUpgrade(this.instrumentOfSilence, this.dustPixie);
            this.player1.fightWith(this.dustPixie, this.yantzeeGang);
            expect(this.dustPixie.location).toBe('play area');
            expect(this.yantzeeGang.tokens.damage).toBe(1);
            expect(this.player1.amber).toBe(1);
        });
    });
});
