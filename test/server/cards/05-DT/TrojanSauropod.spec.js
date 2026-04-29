describe('Trojan Sauropod', function () {
    describe("Trojan Sauropod's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: [
                        'trojan-sauropod',
                        'senator-shrix',
                        'city-gates',
                        'citizen-shrix',
                        'stomp',
                        'siren-horn',
                        'deusillus',
                        'deusillus2',
                        'bawretchadontius'
                    ],
                    discard: ['spyyyder', 'shooler', 'gateway-to-dis', 'gub']
                },
                player2: {
                    hand: ['dextre', 'archimedes']
                }
            });

            this.player1.discard.forEach((card) => {
                this.player1.moveCard(card, 'deck');
            });
        });

        describe('when played', function () {
            beforeEach(function () {
                this.player1.play(this.trojanSauropod);
            });

            it("should start at opponent's play area", function () {
                expect(this.trojanSauropod.location).toBe('play area');

                expect(this.player1.player.cardsInPlay).not.toContain(this.trojanSauropod);
                expect(this.player2.player.cardsInPlay).toContain(this.trojanSauropod);

                expect(this.trojanSauropod.controller).toBe(this.player2.player);
            });

            describe('when opponent uses it', function () {
                beforeEach(function () {
                    this.trojanSauropod.ready();
                    this.player1.endTurn();
                    this.player2.clickPrompt('logos');
                    this.player2.useOmni(this.trojanSauropod);
                });

                it('should gain 3 amber', function () {
                    expect(this.player1.amber).toBe(1);
                    expect(this.player2.amber).toBe(3);
                });

                it('should prompt to put creatures in play', function () {
                    expect(this.player2).toHavePrompt('Choose a creature to put into play');
                    expect(this.player2).toBeAbleToSelect(this.senatorShrix);
                    expect(this.player2).toBeAbleToSelect(this.citizenShrix);
                    expect(this.player2).toBeAbleToSelect(this.deusillus);
                    expect(this.player2).toBeAbleToSelect(this.deusillus2);
                    expect(this.player2).not.toBeAbleToSelect(this.bawretchadontius);
                    expect(this.player2).not.toBeAbleToSelect(this.sirenHorn);
                    expect(this.player2).not.toBeAbleToSelect(this.stomp);
                    expect(this.player2).not.toBeAbleToSelect(this.cityGates);
                    expect(this.player2).not.toBeAbleToSelect(this.dextre);
                });

                it("should put creatures into play and refill opponent's hand", function () {
                    this.player2.clickCard(this.senatorShrix);
                    expect(this.senatorShrix.location).toBe('play area');
                    this.player2.clickCard(this.citizenShrix);
                    this.player2.clickPrompt('Right');
                    expect(this.citizenShrix.location).toBe('play area');
                    this.player2.clickCard(this.deusillus2);
                    this.player2.clickPrompt('Right');
                    expect(this.deusillus2.location).toBe('play area');
                    expect(this.player2).isReadyToTakeAction();
                    expect(this.player1.player.hand.length).toBe(6);
                    expect(this.bawretchadontius.location).toBe('hand');
                    expect(this.gub.location).toBe('hand');
                    expect(this.gatewayToDis.location).toBe('hand');
                    expect(this.trojanSauropod.location).toBe('discard');

                    expect(this.citizenShrix.exhausted).toBe(false);
                    expect(this.senatorShrix.exhausted).toBe(false);
                    expect(this.deusillus2.exhausted).toBe(false);
                    expect(this.player2).isReadyToTakeAction();
                });
            });
        });
    });
});
