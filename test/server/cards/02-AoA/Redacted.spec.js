describe('[Redacted]', function () {
    describe("[Redacted]'s ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'logos',
                    inPlay: ['dextre'],
                    hand: ['[redacted]', 'flaxia']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll', 'gauntlet-of-command']
                }
            });
        });

        it('should not have amber when played', function () {
            this.player1.play(this['[redacted]']);
            expect(this['[redacted]'].amber).toBe(0);
        });

        it('should not add amber when select a non-logos house', function () {
            this.player1.play(this['[redacted]']);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            expect(this['[redacted]'].amber).toBe(0);
        });

        it('should add amber when select logos house', function () {
            this.player1.play(this['[redacted]']);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            expect(this['[redacted]'].amber).toBe(1);
        });

        it('should add 4th amber, forge and sacrifice when select logos house', function () {
            this.player1.play(this['[redacted]']);
            this['[redacted]'].tokens.amber = 2;
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            expect(this['[redacted]'].amber).toBe(3);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.forgeKey('red');
            expect(this['[redacted]'].location).toBe('discard');
            expect(this.player1.amber).toBe(5);
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
