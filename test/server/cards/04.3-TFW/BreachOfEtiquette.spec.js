describe('Breach of Etiquette', function() {
    integration(function() {
        describe('Breach of Etiquette\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 10,
                        inPlay: ['yogo-hiroue', 'soshi-illusionist', 'bayushi-yunako'],
                        hand: ['watch-commander']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['brash-samurai', 'doji-whisperer'],
                        hand: ['breach-of-etiquette', 'banzai']
                    }
                });
                this.brashSamurai = this.player2.findCardByName('brash-samurai');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.watchCommander = this.player1.playAttachment('watch-commander', 'yogo-hiroue');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: ['yogo-hiroue', 'bayushi-yunako'],
                    defenders: ['brash-samurai']
                });
                this.player2.clickCard('breach-of-etiquette');
                this.player1.pass();
            });

            it('should trigger when the opponent uses a non-courtier ability', function() {
                this.player1.clickCard('bayushi-yunako');
                this.player1.clickCard(this.brashSamurai);
                expect(this.player1.honor).toBe(9);
                expect(this.brashSamurai.militarySkill).toBe(1);
            });

            it('should trigger when the player uses a non-courtier ability', function() {
                this.player1.pass();
                this.player2.clickCard(this.brashSamurai);
                expect(this.player2.honor).toBe(10);
                expect(this.brashSamurai.militarySkill).toBe(4);
            });

            it('should not trigger when a courtier uses an ability', function() {
                this.player1.clickCard('yogo-hiroue');
                this.player1.clickCard(this.dojiWhisperer);
                expect(this.player1.honor).toBe(10);
                expect(this.dojiWhisperer.inConflict).toBe(true);
            });

            it('should trigger when a non-courtier outside the conflict uses an ability', function() {
                this.player1.pass();
                this.player2.clickCard(this.brashSamurai);
                this.player1.clickCard('soshi-illusionist');
                this.player1.clickCard(this.brashSamurai);
                expect(this.player1.honor).toBe(9);
                expect(this.brashSamurai.militarySkill).toBe(2);
            });

            it('should not trigger when an event is played', function() {
                this.player1.clickCard('yogo-hiroue');
                this.player1.clickCard(this.dojiWhisperer);
                expect(this.player1.honor).toBe(10);
                expect(this.dojiWhisperer.inConflict).toBe(true);
            });
        });
    });
});
