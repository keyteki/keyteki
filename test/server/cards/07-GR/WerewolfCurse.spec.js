describe('Werewolf Curse', function () {
    describe("Werewolf Curse's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    hand: ['werewolf-curse'],
                    inPlay: ['dust-pixie']
                },
                player2: {
                    amber: 1,
                    inPlay: ['noddy-the-thief', 'troll', 'flaxia']
                }
            });
        });

        it('enrages on play', function () {
            this.player1.playUpgrade(this.werewolfCurse, this.dustPixie);
            expect(this.dustPixie.tokens.enrage).toBe(1);
        });

        it('gives splash attack', function () {
            this.player1.playUpgrade(this.werewolfCurse, this.dustPixie);
            this.player1.fightWith(this.dustPixie, this.troll);
            expect(this.noddyTheThief.location).toBe('discard');
            expect(this.troll.tokens.damage).toBe(1);
            expect(this.flaxia.tokens.damage).toBe(3);
            expect(this.werewolfCurse.location).toBe('discard');
        });

        it('archives after fight', function () {
            this.player1.playUpgrade(this.werewolfCurse, this.dustPixie);
            this.player1.fightWith(this.dustPixie, this.noddyTheThief);
            expect(this.noddyTheThief.tokens.damage).toBe(undefined);
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.werewolfCurse.location).toBe('archives');
        });
    });
});
