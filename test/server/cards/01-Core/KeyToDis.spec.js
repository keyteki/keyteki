describe('Key to Dis', function () {
    describe("Key to Dis's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['key-to-dis', 'ember-imp', 'shooler', 'dextre']
                },
                player2: {
                    inPlay: ['troll', 'krump']
                }
            });
        });

        it('should sacrifice itself and destroy all creatures on omni', function () {
            this.shooler.tokens.ward = 1;
            this.player1.useAction(this.keyToDis, true);
            expect(this.keyToDis.location).toBe('discard');
            expect(this.emberImp.location).toBe('discard');
            expect(this.shooler.location).toBe('play area');
            expect(this.dextre.location).toBe('deck');
            expect(this.troll.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
