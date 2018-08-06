describe('Sadane Student', function() {
    integration(function() {
        describe('Sadane Student\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['sadane-student']
                    },
                    player2: {
                        inPlay: []
                    }
                });
                this.student = this.player1.findCardByName('sadane-student');
                this.noMoreActions();
            });

            function worksWithRing(ringType) {
                it('should give +2 to political skill if the ' + ringType + ' ring is claimed',
                    function() {
                        let political = this.student.getPoliticalSkill();
                        this.player1.claimRing(ringType);
                        expect(this.student.getPoliticalSkill()).toBe(political + 2);
                    }
                );
            }

            for(let ringType of ['air', 'fire']) {
                worksWithRing(ringType);
            }

            function doesntWorkWithRing(ringType) {
                it('should not give +2 to political skill if the ' + ringType + ' ring is claimed',
                    function() {
                        let political = this.student.getPoliticalSkill();
                        this.player1.claimRing(ringType);
                        expect(this.student.getPoliticalSkill()).toBe(political);
                    }
                );
            }

            for(let ringType of ['earth', 'water', 'void']) {
                doesntWorkWithRing(ringType);
            }

            it('should not give +2 to political skill if the opponent claimed the air or fire ring',
                function() {
                    let political = this.student.getPoliticalSkill();
                    this.player2.claimRing('air');
                    this.player2.claimRing('fire');
                    expect(this.student.getPoliticalSkill()).toBe(political);
                }
            );
        });
    });
});
