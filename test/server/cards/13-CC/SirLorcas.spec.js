describe('Sir Lorcas', function () {
    describe("Sir Lorcas's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['sir-lorcas']
                },
                player2: {
                    inPlay: ['lamindra', 'tantadlin']
                }
            });
        });

        it('should gain skirmish when red key is forged', function () {
            this.player1.player.keys = { red: true, blue: false, yellow: false };
            this.player1.reap(this.sirLorcas);
            expect(this.sirLorcas.getKeywordValue('skirmish')).toBe(1);
            expect(this.sirLorcas.getKeywordValue('elusive')).toBe(0);
            expect(this.sirLorcas.getKeywordValue('taunt')).toBe(0);
        });

        it('should gain elusive when yellow key is forged', function () {
            this.player1.player.keys = { red: false, blue: false, yellow: true };
            this.player1.reap(this.sirLorcas);
            expect(this.sirLorcas.getKeywordValue('skirmish')).toBe(0);
            expect(this.sirLorcas.getKeywordValue('elusive')).toBe(1);
            expect(this.sirLorcas.getKeywordValue('taunt')).toBe(0);
        });

        it('should gain taunt when blue key is forged', function () {
            this.player1.player.keys = { red: false, blue: true, yellow: false };
            this.player1.reap(this.sirLorcas);
            expect(this.sirLorcas.getKeywordValue('skirmish')).toBe(0);
            expect(this.sirLorcas.getKeywordValue('elusive')).toBe(0);
            expect(this.sirLorcas.getKeywordValue('taunt')).toBe(1);
        });

        it('should gain multiple keywords when multiple keys are forged', function () {
            this.player1.player.keys = { red: true, blue: true, yellow: false };
            this.player1.reap(this.sirLorcas);
            expect(this.sirLorcas.getKeywordValue('skirmish')).toBe(1);
            expect(this.sirLorcas.getKeywordValue('elusive')).toBe(0);
            expect(this.sirLorcas.getKeywordValue('taunt')).toBe(1);
        });
    });
});
