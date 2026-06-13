describe('FyreBreath(WC)', function () {
    describe('Fyre-breath fight ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['fyre-breath'],
                    inPlay: ['firespitter']
                },
                player2: {
                    inPlay: ['valdr', 'troll', 'nexus']
                }
            });
        });

        it('fyre breath upgrades creature with +3 power and before fight effect dealing 2 damage to neighbors', function () {
            this.player1.playUpgrade(this.fyreBreath, this.firespitter);
            expect(this.firespitter.power).toBe(8);
            this.player1.fightWith(this.firespitter, this.troll);
            this.player1.clickCard(this.firespitter);
            this.player1.clickPrompt('firespitter');

            expect(this.troll.location).toBe('discard');
            expect(this.firespitter.location).toBe('play area');
            expect(this.firespitter.damage).toBe(7);
            expect(this.valdr.damage).toBe(3);
            expect(this.nexus.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('does not deal damage', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['fyre-breath'],
                    inPlay: ['batdrone', 'infomorph']
                },
                player2: {
                    inPlay: ['eldest-bear']
                }
            });
        });

        it('if target is killed by assault', function () {
            this.player1.playUpgrade(this.fyreBreath, this.eldestBear);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.eldestBear, this.batdrone);
            this.player2.clickPrompt('Assault');
            expect(this.infomorph.location).toBe('play area');
            expect(this.infomorph.damage).toBe(0);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
