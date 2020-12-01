describe('Lieutenant Gorvenal', function () {
    describe("Lieutenant Gorvenal's Ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'sanctum',
                    inPlay: ['lieutenant-gorvenal', 'dis-ambassador', 'sequis', 'praefectus-ludo']
                },
                player2: {
                    amber: 3,
                    inPlay: ['silvertooth', 'gamgee', 'krump', 'troll']
                }
            });
        });

        it('should capture an amber after it fights and survives', function () {
            this.player1.fightWith(this.lieutenantGorvenal, this.silvertooth);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.lieutenantGorvenal.amber).toBe(1);
            expect(this.sequis.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
        });

        it('should not capture an amber after it fights and dies', function () {
            this.player1.fightWith(this.lieutenantGorvenal, this.troll);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.lieutenantGorvenal.location).toBe('discard');
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(3);
        });

        it('should capture an amber after a friendly creature fights and survives', function () {
            this.player1.fightWith(this.sequis, this.silvertooth);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.lieutenantGorvenal.amber).toBe(1);
            expect(this.sequis.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
        });

        it('should capture an amber after a friendly creature fights and dies', function () {
            this.player1.fightWith(this.disAmbassador, this.silvertooth);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.lieutenantGorvenal.amber).toBe(1);
            expect(this.sequis.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
        });

        it('should not capture an amber after an enemy creature fights', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.silvertooth, this.disAmbassador);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
            expect(this.lieutenantGorvenal.amber).toBe(0);
            expect(this.sequis.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
        });
    });

    describe("Lieutenant Gorvenal's Ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'saurian',
                    inPlay: ['lieutenant-gorvenal', 'citizen-shrix', 'troll', 'bulwark'],
                    hand: ['exile']
                },
                player2: {
                    amber: 3,
                    inPlay: ['barrister-joya']
                }
            });

            this.player1.play(this.exile);
            this.player1.clickCard(this.bulwark);
            this.player1.clickPrompt('left');
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
        });

        it('should not capture after an exiled creature fights and not die', function () {
            this.player2.fightWith(this.bulwark, this.citizenShrix);
            expect(this.bulwark.location).toBe('play area');
            expect(this.citizenShrix.location).toBe('discard');
            expect(this.lieutenantGorvenal.amber).toBe(0);
        });

        it('should not capture after an exiled creature fights and dies', function () {
            this.player2.fightWith(this.bulwark, this.troll);
            expect(this.troll.location).toBe('play area');
            expect(this.bulwark.location).toBe('discard');
            expect(this.lieutenantGorvenal.amber).toBe(0);
        });
    });
});
