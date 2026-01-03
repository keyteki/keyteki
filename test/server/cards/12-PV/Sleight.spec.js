describe('Sleight', function () {
    describe("Sleight's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['sleight', 'urchin', 'hunting-witch', 'umbra'],
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ]
                },
                player2: {
                    inPlay: ['mooncurser', 'murkens', 'krump']
                }
            });
        });

        it('should shuffle all creatures into their owners deck when destroyed', function () {
            let shuffled = [];
            this.player2.player.game.on('onDeckShuffled', (event) => shuffled.push(event.player));
            this.player1.fightWith(this.sleight, this.krump);
            expect(shuffled).toContain(this.player1.player);
            expect(shuffled).toContain(this.player2.player);
            expect(this.sleight.location).toBe('deck');
            expect(this.urchin.location).toBe('deck');
            expect(this.huntingWitch.location).toBe('deck');
            expect(this.umbra.location).toBe('deck');
            expect(this.mooncurser.location).toBe('deck');
            expect(this.murkens.location).toBe('deck');
            expect(this.krump.location).toBe('deck');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should shuffle a friendly creature for each enemy Shadows creature when fate is triggered', function () {
            this.player1.moveCard(this.sleight, 'hand');
            this.player1.activateProphecy(this.overreach, this.sleight);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            let shuffled = [];
            this.player2.player.game.on('onDeckShuffled', (event) => shuffled.push(event.player));
            this.player2.reap(this.mooncurser);
            // There are 2 enemy Shadows creatures, so 2 friendly creatures should be shuffled
            expect(this.player2).toBeAbleToSelect(this.mooncurser);
            expect(this.player2).toBeAbleToSelect(this.murkens);
            expect(this.player2).toBeAbleToSelect(this.krump);
            expect(this.player2).not.toBeAbleToSelect(this.urchin);
            expect(this.player2).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player2).not.toBeAbleToSelect(this.umbra);
            this.player2.clickCard(this.mooncurser);
            this.player2.clickCard(this.murkens);
            expect(shuffled.length).toBe(2);
            expect(shuffled[0]).toBe(this.player2.player);
            expect(shuffled[1]).toBe(this.player2.player);
            expect(this.sleight.location).toBe('discard');
            expect(this.urchin.location).toBe('play area');
            expect(this.huntingWitch.location).toBe('play area');
            expect(this.umbra.location).toBe('play area');
            expect(this.mooncurser.location).toBe('deck');
            expect(this.murkens.location).toBe('deck');
            expect(this.krump.location).toBe('play area');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
