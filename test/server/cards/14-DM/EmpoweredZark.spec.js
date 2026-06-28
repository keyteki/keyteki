describe('Empowered Zark', function () {
    describe("Empowered Zark's fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['empowered-zark', 'iyxrenu-the-clever', 'john-smyth']
                },
                player2: {
                    amber: 5,
                    inPlay: ['urchin', 'tangrant', 'agent-hoo-man']
                }
            });
            this.iyxrenuTheClever.exhaust();
            this.johnSmyth.exhaust();
            this.urchin.exhaust();
            this.tangrant.exhaust();
            this.agentHooMan.exhaust();
        });

        it('captures 2 amber on fight; if 3+ amber, may ready non-Agent Mars creatures on both sides', function () {
            this.empoweredZark.amber = 1;
            this.player1.fightWith(this.empoweredZark, this.urchin);
            expect(this.empoweredZark.amber).toBe(3);
            expect(this.player1).toHavePrompt('Do you wish to move amber to common supply?');
            this.player1.clickPrompt('Yes');
            expect(this.empoweredZark.amber).toBe(0);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            expect(this.empoweredZark.exhausted).toBe(true);
            expect(this.iyxrenuTheClever.exhausted).toBe(false);
            expect(this.johnSmyth.exhausted).toBe(true);
            expect(this.urchin.exhausted).toBe(true);
            expect(this.tangrant.exhausted).toBe(false);
            expect(this.agentHooMan.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('still readies when Empowered Zark starts with 2 amber, leaving 1 amber on it', function () {
            this.empoweredZark.amber = 2;
            this.player1.fightWith(this.empoweredZark, this.urchin);
            expect(this.empoweredZark.amber).toBe(4);
            this.player1.clickPrompt('Yes');
            expect(this.empoweredZark.amber).toBe(1);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            expect(this.empoweredZark.exhausted).toBe(true);
            expect(this.iyxrenuTheClever.exhausted).toBe(false);
            expect(this.johnSmyth.exhausted).toBe(true);
            expect(this.urchin.exhausted).toBe(true);
            expect(this.tangrant.exhausted).toBe(false);
            expect(this.agentHooMan.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing extra when Empowered Zark has fewer than 3 amber', function () {
            this.iyxrenuTheClever.exhaust();
            this.johnSmyth.exhaust();
            this.tangrant.exhaust();
            this.agentHooMan.exhaust();
            this.urchin.exhaust();
            this.player1.fightWith(this.empoweredZark, this.urchin);
            expect(this.empoweredZark.amber).toBe(2);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            expect(this.empoweredZark.exhausted).toBe(true);
            expect(this.iyxrenuTheClever.exhausted).toBe(true);
            expect(this.johnSmyth.exhausted).toBe(true);
            expect(this.urchin.exhausted).toBe(true);
            expect(this.tangrant.exhausted).toBe(true);
            expect(this.agentHooMan.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
