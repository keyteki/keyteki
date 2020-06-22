describe('Nurse Soto', function () {
    describe("Nurse Soto's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['nexus'],
                    hand: ['urchin', 'poison-wave']
                },
                player2: {
                    amber: 1,
                    inPlay: ['lieutenant-khrkhar', 'nurse-soto', 'medic-ingram']
                }
            });
        });
        it("should heal 3 damage from it's neighbours when it reaps", function () {
            this.player1.play(this.poisonWave);
            expect(this.lieutenantKhrkhar.tokens.damage).toBe(2);
            expect(this.nurseSoto.tokens.damage).toBe(2);
            expect(this.medicIngram.tokens.damage).toBe(2);
            this.player1.endTurn();
            this.player2.clickPrompt('staralliance');
            this.player2.reap(this.nurseSoto);
            expect(this.player2.amber).toBe(2);
            expect(this.medicIngram.tokens.damage).toBe(undefined);
            expect(this.nurseSoto.tokens.damage).toBe(2);
            expect(this.lieutenantKhrkhar.tokens.damage).toBe(undefined);
        });
        it("should heal 3 damage from it's neighbours when it fights", function () {
            this.player1.play(this.poisonWave);
            expect(this.lieutenantKhrkhar.tokens.damage).toBe(2);
            expect(this.nurseSoto.tokens.damage).toBe(2);
            expect(this.medicIngram.tokens.damage).toBe(2);
            this.player1.endTurn();
            this.player2.clickPrompt('staralliance');
            this.player2.fightWith(this.nurseSoto, this.nexus);
            expect(this.player2.amber).toBe(1);
            expect(this.medicIngram.tokens.damage).toBe(undefined);
            expect(this.nurseSoto.tokens.damage).toBe(2);
            expect(this.lieutenantKhrkhar.tokens.damage).toBe(undefined);
        });
    });
    describe("Nurse Soto's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['nexus'],
                    hand: ['urchin', 'poison-wave']
                },
                player2: {
                    amber: 1,
                    hand: ['nurse-soto'],
                    inPlay: ['lieutenant-khrkhar', 'medic-ingram']
                }
            });
        });
        it("should heal 3 damage from it's neighbours when it is played", function () {
            this.player1.play(this.poisonWave);
            expect(this.lieutenantKhrkhar.tokens.damage).toBe(2);
            expect(this.medicIngram.tokens.damage).toBe(2);
            this.player1.endTurn();
            this.player2.clickPrompt('staralliance');
            this.player2.play(this.nurseSoto);
            expect(this.medicIngram.tokens.damage).toBe(undefined);
            expect(this.nurseSoto.tokens.damage).toBe(undefined);
            expect(this.lieutenantKhrkhar.tokens.damage).toBe(2);
        });
    });
});
