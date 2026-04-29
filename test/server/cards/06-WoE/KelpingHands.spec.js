describe('Kelping Hands', function () {
    describe('in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 1,
                    hand: ['pyr*0'],
                    inPlay: ['flaxia', 'chelonia', 'kelping-hands']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });

            this.player1.playUpgrade(this['pyr*0'], this.chelonia);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
        });

        describe('before used,', function () {
            it('creatures should not have poison', function () {
                expect(this.flaxia.hasKeyword('poison')).toBe(false);
                expect(this.chelonia.hasKeyword('poison')).toBe(false);
            });

            it('creatures should not kill Krump', function () {
                this.player1.fightWith(this.chelonia, this.krump);
                expect(this.chelonia.location).toBe('discard');
                expect(this.krump.location).toBe('play area');
            });
        });

        describe('after omni used,', function () {
            beforeEach(function () {
                this.player1.useOmni(this.kelpingHands);
            });

            it('Kelping Hands should be destroyed', function () {
                expect(this.kelpingHands.location).toBe('discard');
            });

            it('creatures should have poison', function () {
                expect(this.flaxia.hasKeyword('poison')).toBe(true);
                expect(this.chelonia.hasKeyword('poison')).toBe(true);
            });

            it('creatures should kill Krump', function () {
                this.player1.fightWith(this.chelonia, this.krump);
                expect(this.chelonia.location).toBe('discard');
                expect(this.krump.location).toBe('discard');
            });

            it('should not apply to enemy creatures', function () {
                this.player1.fightWith(this.flaxia, this.gub);
                expect(this.flaxia.location).toBe('play area');
                expect(this.flaxia.damage).toBe(1);
                expect(this.gub.location).toBe('discard');
            });

            it('should not apply to splash damage', function () {
                this.player1.fightWith(this.chelonia, this.gub);
                expect(this.chelonia.location).toBe('play area');
                expect(this.chelonia.damage).toBe(1);
                expect(this.gub.location).toBe('discard');
                expect(this.krump.location).toBe('play area');
                expect(this.krump.damage).toBe(3);
            });
        });
    });
});
