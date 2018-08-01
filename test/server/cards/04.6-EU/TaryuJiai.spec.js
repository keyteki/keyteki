describe('Taryu Jiai', function() {
    integration(function() {
        describe('Taryu Jiai\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['asako-azunami', 'adept-of-the-waves'],
                        hand: ['taryu-jiai']
                    },
                    player2: {
                        honor: 10,
                        inPlay: ['soshi-illusionist', 'soshi-shiori']
                    }
                });
                this.soshiIllusionist = this.player2.findCardByName('soshi-illusionist');
                this.soshiShiori = this.player2.findCardByName('soshi-shiori');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['adept-of-the-waves'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('taryu-jiai');
            });

            it('should allow choosing shugenja inside or outside the conflict', function() {
                expect(this.player1).toHavePrompt('Choose a friendly shugenja');
                expect(this.player1).toBeAbleToSelect('asako-azunami');
                expect(this.player1).toBeAbleToSelect('adept-of-the-waves');
                this.asakoAzunami = this.player1.clickCard('asako-azunami');
                expect(this.player1).toHavePrompt('Choose an opposing shugenja');
                expect(this.player1).toBeAbleToSelect(this.soshiIllusionist);
                expect(this.player1).toBeAbleToSelect(this.soshiShiori);
            });

            it('should resolve a glory duel correctly', function() {
                this.asakoAzunami = this.player1.clickCard('asako-azunami');
                this.player1.clickCard(this.soshiIllusionist);
                expect(this.player1).toHavePrompt('Choose your bid for the duel\nAsako Azunami: 3 vs 1: Soshi Illusionist');
                this.player1.clickPrompt('2');
                this.player2.clickPrompt('1');
                expect(this.player1.honor).toBe(10);
                expect(this.player2.honor).toBe(11);
                expect(this.asakoAzunami.glory).toBe(5);
                expect(this.soshiIllusionist.glory).toBe(2);
                expect(this.player1).toHavePrompt('Choose a ring effect to resolve');
            });

            it('should resolve the ring correctly', function() {
                this.asakoAzunami = this.player1.clickCard('asako-azunami');
                this.player1.clickCard(this.soshiIllusionist);
                this.player1.clickPrompt('2');
                this.player2.clickPrompt('1');
                this.player1.clickRing('fire');
                expect(this.player1).toHavePrompt('Fire Ring');
                this.player1.clickCard(this.asakoAzunami);
                this.player1.clickPrompt('Honor Asako Azunami');
                expect(this.asakoAzunami.isHonored).toBe(true);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should allow ring replacement effects', function() {
                this.asakoAzunami = this.player1.clickCard('asako-azunami');
                this.asakoAzunami.bowed = true;
                this.player1.clickCard(this.soshiIllusionist);
                this.player1.clickPrompt('2');
                this.player2.clickPrompt('1');
                this.player1.clickRing('water');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.asakoAzunami);
                this.player1.clickCard(this.asakoAzunami);
                expect(this.player1).toHavePrompt('Asako Azunami');
                this.player1.clickCard(this.soshiShiori);
                this.player1.clickCard(this.asakoAzunami);
                expect(this.asakoAzunami.bowed).toBe(false);
                expect(this.soshiShiori.bowed).toBe(true);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
