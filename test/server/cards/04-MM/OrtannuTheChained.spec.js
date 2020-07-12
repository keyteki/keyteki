describe('Ortannu The Chained', function () {
    describe("Ortannu The Chained's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['ortannu-the-chained', 'lamindra'],
                    hand: [
                        'ortannu-s-binding',
                        'ortannu-s-binding',
                        'ortannu-s-binding',
                        'ortannu-s-binding'
                    ]
                },
                player2: {
                    amber: 1,
                    inPlay: ['brammo', 'alaka', 'troll', 'zorg']
                }
            });

            this.ortannusBinding1 = this.player1.player.hand[0];
            this.ortannusBinding2 = this.player1.player.hand[1];
            this.ortannusBinding3 = this.player1.player.hand[2];
            this.ortannusBinding4 = this.player1.player.hand[3];
        });

        it('should return no card from discard', function () {
            this.player1.reap(this.ortannuTheChained);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should return all bindings from discard and apply the 2D for each returned card', function () {
            this.player1.moveCard(this.ortannusBinding1, 'discard');
            this.player1.moveCard(this.ortannusBinding2, 'discard');
            this.player1.moveCard(this.ortannusBinding3, 'archives');
            this.player1.reap(this.ortannuTheChained);
            expect(this.ortannusBinding1.location).toBe('hand');
            expect(this.ortannusBinding2.location).toBe('hand');
            expect(this.ortannusBinding3.location).toBe('archives');
            expect(this.ortannusBinding4.location).toBe('hand');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toBeAbleToSelect(this.ortannuTheChained);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.alaka);
            expect(this.player1).toBeAbleToSelect(this.brammo);
            expect(this.player1).toBeAbleToSelect(this.zorg);
            this.player1.clickCard(this.zorg);
            this.player1.clickCard(this.troll);
            expect(this.zorg.tokens.damage).toBe(4);
            expect(this.troll.tokens.damage).toBe(4);
            expect(this.alaka.tokens.damage).toBe(2);
            expect(this.brammo.tokens.damage).toBeUndefined();
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow dealing damage to same creature', function () {
            this.player1.moveCard(this.ortannusBinding1, 'discard');
            this.player1.moveCard(this.ortannusBinding2, 'discard');
            this.player1.moveCard(this.ortannusBinding3, 'archives');
            this.player1.reap(this.ortannuTheChained);
            expect(this.player1.amber).toBe(1);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.zorg.tokens.damage).toBe(4);
            expect(this.troll.tokens.damage).toBe(4);
            expect(this.alaka.location).toBe('discard');
            expect(this.brammo.tokens.damage).toBeUndefined();
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should remove ward cards simultanously', function () {
            this.player1.moveCard(this.ortannusBinding1, 'discard');
            this.player1.moveCard(this.ortannusBinding2, 'discard');
            this.player1.moveCard(this.ortannusBinding3, 'archives');
            this.troll.tokens.ward = 1;
            this.zorg.tokens.ward = 1;
            this.player1.reap(this.ortannuTheChained);
            expect(this.player1.amber).toBe(1);
            this.player1.clickCard(this.zorg);
            this.player1.clickCard(this.troll);
            expect(this.zorg.tokens.ward).toBeUndefined();
            expect(this.zorg.tokens.damage).toBeUndefined();
            expect(this.troll.tokens.ward).toBeUndefined();
            expect(this.troll.tokens.damage).toBeUndefined();
            expect(this.alaka.tokens.damage).toBe(2);
            expect(this.brammo.tokens.damage).toBeUndefined();
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
