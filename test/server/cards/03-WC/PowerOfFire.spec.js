describe('PowerOfFire(WC)', function () {
    describe('PowerOfFire action', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 8,
                    house: 'brobnar',
                    hand: ['power-of-fire', 'armageddon-cloak'],
                    inPlay: ['troll', 'self-bolstering-automata', 'barrister-joya']
                },
                player2: {
                    amber: 7,
                    inPlay: ['dextre']
                }
            });

            this.selfBolsteringAutomata.powerCounters = 13;
            this.selfBolsteringAutomata.damage = 3;
        });

        it("makes players lose half of troll's power == 4", function () {
            this.player1.play(this.powerOfFire);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(3);
            expect(this.player1.chains).toBe(1);
            expect(this.player2.chains).toBe(0);
            this.player1.endTurn();
        });

        it('a warded creature does not make players lose amber, but still get the chains', function () {
            this.troll.ward();
            this.player1.play(this.powerOfFire);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('play area');
            expect(this.troll.warded).toBe(false);
            expect(this.player1.amber).toBe(8);
            expect(this.player2.amber).toBe(7);
            expect(this.player1.chains).toBe(1);
            expect(this.player2.chains).toBe(0);
            this.player1.endTurn();
        });

        it('should interact with self-bostering automata', function () {
            this.player1.play(this.powerOfFire);
            this.player1.clickCard(this.selfBolsteringAutomata);
            this.player1.clickPrompt('Right');
            expect(this.selfBolsteringAutomata.location).toBe('play area');
            expect(this.selfBolsteringAutomata.damage).toBe(0);
            expect(this.selfBolsteringAutomata.exhausted).toBe(true);
            expect(this.player1.amber).toBe(8);
            expect(this.player2.amber).toBe(7);
            expect(this.player1.chains).toBe(1);
            expect(this.player2.chains).toBe(0);
            this.player1.endTurn();
        });

        it('should interact with self-bostering automata', function () {
            this.player1.play(this.powerOfFire);
            this.player1.clickCard(this.selfBolsteringAutomata);
            this.player1.clickPrompt('Right');
            expect(this.selfBolsteringAutomata.location).toBe('play area');
            expect(this.selfBolsteringAutomata.damage).toBe(0);
            expect(this.selfBolsteringAutomata.exhausted).toBe(true);
            expect(this.player1.amber).toBe(8);
            expect(this.player2.amber).toBe(7);
            expect(this.player1.chains).toBe(1);
            expect(this.player2.chains).toBe(0);
            this.player1.endTurn();
        });

        it("makes players lose half of barrister's power == 2", function () {
            this.player1.play(this.powerOfFire);
            this.player1.clickCard(this.barristerJoya);
            expect(this.barristerJoya.location).toBe('discard');
            expect(this.player1.amber).toBe(6);
            expect(this.player2.amber).toBe(5);
            expect(this.player1.chains).toBe(1);
            expect(this.player2.chains).toBe(0);
            this.player1.endTurn();
        });
    });
});
