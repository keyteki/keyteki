describe('Eldritch Synan', function () {
    describe("Eldritch Synan's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['seeker-needle', 'a-vinda', 'scylla']
                },
                player2: {
                    inPlay: ['eldritch-synan']
                }
            });
        });

        it('can be damaged by undamaged creatures when attacked', function () {
            this.player1.fightWith(this.aVinda, this.eldritchSynan);
            expect(this.eldritchSynan.location).toBe('discard');
            expect(this.aVinda.tokens.damage).toBe(3);
        });

        it('can be damaged by undamaged creatures when attacking', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('unfathomable');
            this.player2.fightWith(this.eldritchSynan, this.aVinda);
            expect(this.eldritchSynan.location).toBe('discard');
            expect(this.aVinda.tokens.damage).toBe(3);
        });

        it('can be damaged by undamaged creatures using abilities', function () {
            this.player1.reap(this.aVinda);
            this.player1.clickCard(this.eldritchSynan);
            expect(this.eldritchSynan.tokens.damage).toBe(1);
        });

        it('can be damaged by undamaged self using abilities', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('unfathomable');
            this.player2.reap(this.eldritchSynan);
            expect(this.eldritchSynan.location).toBe('discard');
        });

        it('cannot be damaged by damaged creatures when attacked', function () {
            this.player1.useAction(this.seekerNeedle);
            this.player1.clickCard(this.aVinda);
            this.player1.fightWith(this.aVinda, this.eldritchSynan);
            expect(this.eldritchSynan.location).toBe('play area');
            expect(this.eldritchSynan.tokens.damage).toBe(undefined);
            expect(this.aVinda.location).toBe('discard');
        });

        it('cannot be damaged by damaged creatures when attacking', function () {
            this.player1.useAction(this.seekerNeedle);
            this.player1.clickCard(this.aVinda);
            this.player1.endTurn();
            this.player2.clickPrompt('unfathomable');
            this.player2.fightWith(this.eldritchSynan, this.aVinda);
            expect(this.eldritchSynan.location).toBe('play area');
            expect(this.eldritchSynan.tokens.damage).toBe(undefined);
            expect(this.aVinda.location).toBe('discard');
        });

        it('cannot be damaged by damaged creatures using abilities', function () {
            this.player1.useAction(this.seekerNeedle);
            this.player1.clickCard(this.aVinda);
            this.player1.reap(this.aVinda);
            this.player1.clickCard(this.eldritchSynan);
            expect(this.eldritchSynan.location).toBe('play area');
            expect(this.eldritchSynan.tokens.damage).toBe(undefined);
        });

        it('cannot be damaged by damaged self using abilities', function () {
            this.player1.useAction(this.seekerNeedle);
            this.player1.clickCard(this.eldritchSynan);
            this.player1.endTurn();
            this.player2.clickPrompt('unfathomable');
            this.player2.reap(this.eldritchSynan);
            expect(this.eldritchSynan.location).toBe('play area');
            expect(this.eldritchSynan.tokens.damage).toBe(1);
        });
    });
});
