describe('Awakened Tsukumogami', function() {
    integration(function() {
        describe('Awakened Tsukumogami\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['agasha-swordsmith']
                    },
                    player2: {
                        fate: 1,
                        inPlay: ['awakened-tsukumogami', 'asako-azunami'],
                        hand: ['against-the-waves', 'consumed-by-five-fires', 'the-mirror-s-gaze', 'daimyo-s-favor']
                    }
                });
                this.agashaSwordsmith = this.player1.findCardByName('agasha-swordsmith');
                this.agashaSwordsmith.fate = 4;
                this.game.rings.air.fate = 2;
                this.game.rings.water.fate = 2;
                this.game.rings.fire.fate = 5;
                this.player1.pass();
            });

            it('should allow the player to choose whether to take fate from the ring or their fate pool', function() {
                this.player2.clickCard('against-the-waves');
                expect(this.player2).toHavePrompt('Against the Waves');
                this.player2.clickCard(this.agashaSwordsmith);
                expect(this.player2).toHavePrompt('Choose amount of fate to spend from the Water ring');
                expect(this.player2.currentButtons.length).toBe(3);
                expect(this.player2.currentButtons).toContain('0');
                expect(this.player2.currentButtons).toContain('1');
                expect(this.player2.currentButtons).toContain('Cancel');
            });

            it('should pay with ring fate when selected', function() {
                this.player2.clickCard('against-the-waves');
                this.player2.clickCard(this.agashaSwordsmith);
                this.player2.clickPrompt('1');
                expect(this.player2.fate).toBe(1);
                expect(this.game.rings.water.fate).toBe(1);
                expect(this.agashaSwordsmith.bowed).toBe(true);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should pay with own fate when selected', function() {
                this.player2.clickCard('against-the-waves');
                this.player2.clickCard(this.agashaSwordsmith);
                this.player2.clickPrompt('0');
                expect(this.player2.fate).toBe(0);
                expect(this.game.rings.water.fate).toBe(2);
                expect(this.agashaSwordsmith.bowed).toBe(true);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should correctly offer options when the player doesn\'t have enough fate in their pool', function() {
                this.player2.fate = 3;
                this.player2.clickCard('consumed-by-five-fires');
                expect(this.player2).toHavePrompt('Choose amount of fate to spend from the Fire ring');
                expect(this.player2.currentButtons.length).toBe(5);
                expect(this.player2.currentButtons).toContain('2');
                expect(this.player2.currentButtons).toContain('3');
                expect(this.player2.currentButtons).toContain('4');
                expect(this.player2.currentButtons).toContain('5');
                expect(this.player2.currentButtons).toContain('Cancel');
                this.player2.clickPrompt('3');
                expect(this.player2.fate).toBe(1);
                expect(this.game.rings.fire.fate).toBe(2);
                expect(this.player2).toHavePrompt('Choose a character');
            });

            it('should work with attachments', function() {
                this.daimyosFavor = this.player2.playAttachment('daimyo-s-favor', 'asako-azunami');
                this.player1.pass();
                this.player2.clickCard(this.daimyosFavor);
                this.player1.pass();
                this.mirrorsGaze = this.player2.clickCard('the-mirror-s-gaze');
                expect(this.player2).toHavePrompt('The Mirror\'s Gaze');
                this.player2.clickCard('asako-azunami');
                expect(this.player2).toHavePrompt('Choose amount of fate to spend from the Air ring');
                expect(this.player2.currentButtons.length).toBe(3);
                expect(this.player2.currentButtons).toContain('0');
                expect(this.player2.currentButtons).toContain('1');
                expect(this.player2.currentButtons).toContain('Cancel');
                this.player2.clickPrompt('1');
                expect(this.mirrorsGaze.location).toBe('play area');
                expect(this.player2.fate).toBe(1);
                expect(this.game.rings.air.fate).toBe(1);
            });
        });
    });
});
