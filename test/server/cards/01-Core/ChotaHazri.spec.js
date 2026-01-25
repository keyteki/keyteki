describe('Chota Hazri', function () {
    describe("Chota Hazri's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 7,
                    house: 'untamed',
                    hand: [
                        'chota-hazri',
                        'fog-murmook',
                        'fog-murmook',
                        'fog-murmook',
                        'fog-murmook',
                        'fog-murmook',
                        'fog-murmook',
                        'ancient-bear',
                        'bigtwig'
                    ]
                },
                player2: {}
            });
            this.fogMurmook1 = this.player1.player.hand[1];
            this.fogMurmook2 = this.player1.player.hand[2];
            this.fogMurmook3 = this.player1.player.hand[3];
            this.fogMurmook4 = this.player1.player.hand[4];
            this.fogMurmook5 = this.player1.player.hand[5];
            this.fogMurmook6 = this.player1.player.hand[6];
        });

        it('should lose 1 amber and allow forging a key', function () {
            this.player1.play(this.chotaHazri);
            expect(this.player1).toHavePrompt('Do you wish to forge a key?');
            this.player1.clickPrompt('Yes');
            this.player1.forgeKey('Red');
            expect(this.player1.amber).toBe(0);
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should lose 1 amber and allow declining to forge', function () {
            this.player1.play(this.chotaHazri);
            expect(this.player1).toHavePrompt('Do you wish to forge a key?');
            this.player1.clickPrompt('No');
            expect(this.player1.amber).toBe(6);
            expect(this.player1.player.keys.red).toBe(false);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);

            expect(this.player1).isReadyToTakeAction();
        });

        it('should lose 1 amber and not forge without enough amber', function () {
            this.player1.amber = 6;
            this.player1.play(this.chotaHazri);
            expect(this.player1.amber).toBe(5);
            expect(this.player1.player.keys.red).toBe(false);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not forge at 0 cost 0 amber', function () {
            this.player1.amber = 0;
            this.player1.playCreature(this.ancientBear);
            this.player1.playCreature(this.fogMurmook1);
            this.player1.playCreature(this.fogMurmook2);
            this.player1.playCreature(this.fogMurmook3);
            this.player1.playCreature(this.fogMurmook4);
            this.player1.playCreature(this.fogMurmook5);
            this.player1.playCreature(this.fogMurmook6);
            this.player1.playCreature(this.bigtwig);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.player.getCurrentKeyCost()).toBe(0);
            this.player1.play(this.chotaHazri);
            expect(this.player1.amber).toBe(0);
            expect(this.player1.player.keys.red).toBe(false);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
