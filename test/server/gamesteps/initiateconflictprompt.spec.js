const InitateConflictPrompt = require('../../../server/game/gamesteps/conflict/initiateconflictprompt.js');

describe('InitateConflictPrompt: ', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'raiseEvent', 'promptWithHandlerMenu']);
        this.playerSpy = jasmine.createSpyObj('player', ['keep', 'mulligan']);
        this.conflictSpy = jasmine.createSpyObj('conflict', ['calculateSkill', 'removeFromConflict', 'addAttacker']);
        this.conflictSpy.conflictRing = '';
        this.conflictSpy.conflictType = '';
        this.conflictSpy.attackers = [];
        this.conflictSpy.conflictProvince = null;
        this.prompt = new InitateConflictPrompt(this.gameSpy, this.conflictSpy, this.playerSpy);
    });

    describe('the activePrompt() function', function() {
        describe('when nothing is selected', function() {
            beforeEach(function() {
                this.promptProperties = this.prompt.activePrompt();
            });

            it('should ask the player to choose a ring', function() {
                expect(this.promptProperties.menuTitle).toContain('Choose an elemental ring');
            });

            it('should be titled Initiate Conflict', function() {
                expect(this.promptProperties.promptTitle).toBe('Initiate Conflict');
            });

            it('should display a Pass Conflict button', function() {
                expect(this.promptProperties.buttons).toContain({ text: 'Pass Conflict', arg: 'pass' });
            });
        });

        describe('when a military fire ring has been chosen', function() {
            beforeEach(function() {
                this.conflictSpy.conflictRing = 'fire';
                this.conflictSpy.conflictType = 'military';
                this.promptProperties = this.prompt.activePrompt();
            });

            it('should have the right promptTitle', function() {
                expect(this.promptProperties.promptTitle).toBe('Military Fire Conflict');
            });

            it('should prompt the player to choose a province', function() {
                expect(this.promptProperties.menuTitle).toBe('Choose province to attack');
            });

            describe('and attackers have been selected', function() {
                beforeEach(function() {
                    this.conflictSpy.conflictProvince = { name: 'Shameful Display' };
                    this.conflictSpy.attackers.push({ name: 'Shiba Tsukune' });
                    this.conflictSpy.attackerSkill = 4;
                    this.promptProperties = this.prompt.activePrompt();
                });

                it('should check skill totals', function() {
                    expect(this.conflictSpy.calculateSkill).toHaveBeenCalled();
                });

                it('should display total Skill selected', function() {
                    expect(this.promptProperties.menuTitle).toContain('skill: 4');
                });

                it('should display an Initiate Conflict button', function() {
                    expect(this.promptProperties.buttons).toContain({ text: 'Initiate Conflict', arg: 'done' });
                });

                describe('and some attackers have covert', function() {
                    beforeEach(function() {
                        this.prompt.covertRemaining = true;
                        this.promptProperties = this.prompt.activePrompt();
                    });

                    it('should prompt the player to choose covert targets', function() {
                        expect(this.promptProperties.menuTitle).toBe('Choose defenders to Covert');
                    });
                });
            });
        });
    });

    describe('the cardClicked function, ', function() {
        beforeEach(function() {
            this.cardSpy = jasmine.createSpyObj('card', ['allowGameAction', 'canDeclareAsAttacker', 'isCovert', 'canBeBypassedByCovert']);
        });

        describe('when a different player clicks a card, ', function() {
            beforeEach(function() {
                this.opponent = { name: 'opponent' };
            });

            it('should return false', function() {
                expect(this.prompt.onCardClicked(this.opponent, this.cardSpy)).toBe(false);
            });
        });

        describe('when the card is a province, ', function() {
            beforeEach(function() {
                this.cardSpy.isProvince = true;
                this.cardSpy.controller = this.opponent;
                this.cardSpy.isBroken = false;
                this.prompt.onCardClicked(this.playerSpy, this.cardSpy);
            });

            describe('if it\'s controlled by this player, ', function() {
                beforeEach(function() {
                    this.cardSpy.controller = this.playerSpy;
                });

                it('should return false', function() {
                    expect(this.prompt.onCardClicked(this.playerSpy, this.cardSpy)).toBe(false);
                });
            });

            describe('if it\'s broken, ', function() {
                beforeEach(function() {
                    this.cardSpy.isBroken = true;
                });

                it('should return false', function() {
                    expect(this.prompt.onCardClicked(this.playerSpy, this.cardSpy)).toBe(false);
                });                
            });

            describe('if a conflict can\'t be initiated here, ', function() {
                beforeEach(function() {
                    this.cardSpy.allowGameAction.and.returnValue(false);
                });

                it('should return false', function() {
                    expect(this.prompt.onCardClicked(this.playerSpy, this.cardSpy)).toBe(false);
                });                
            });

            describe('if it\'s the stronghold province and fewer than 3 provinces have been broken, ', function() {
                beforeEach(function() {
                    this.cardSpy.location = 'stronghold province';
                    this.allCardsSpy = jasmine.createSpyObj('allCards', ['filter']);
                    this.allCardsSpy.filter.and.returnValue(2);
                    this.gameSpy.allCards = this.allCardsSpy;
                });

                it('should return false', function() {
                    expect(this.prompt.onCardClicked(this.playerSpy, this.cardSpy)).toBe(false);
                });                
            });

            describe('if a conflict can be initiated here', function() {
                beforeEach(function() {
                    this.cardSpy.allowGameAction.and.returnValue(true);
                    this.returnValue = this.prompt.onCardClicked(this.playerSpy, this.cardSpy)
                });

                describe('and it\'s currently the conflict province, ', function() {
                    beforeEach(function() {
                        this.cardSpy.inConflict = true;
                        this.conflictSpy.conflictProvince = this.cardSpy;
                        this.returnValue = this.prompt.onCardClicked(this.playerSpy, this.cardSpy);
                    });

                    it('should return true', function() {
                        expect(this.returnValue).toBe(true);
                    });                

                    it('should remove the province from the conflict', function() {
                        expect(this.cardSpy.inConflict).toBe(false);
                    })

                    it('should change the conflict province to null', function() {
                        expect(this.conflictSpy.conflictProvince).toBe(null);
                    });
                });

                it('should return true', function() {
                    expect(this.returnValue).toBe(true);
                });                

                it('should become the conflict province', function() {
                    expect(this.conflictSpy.conflictProvince).toBe(this.cardSpy);
                });

                it('should mark the province as in the conflict', function() {
                    expect(this.cardSpy.inConflict).toBe(true);
                });
            });
        });

        describe('when the card is a character,', function () {
            beforeEach(function() {
                this.cardSpy.type = 'character';
            });

            describe('if the character is controlled by this player,', function() {
                beforeEach(function() {
                    this.cardSpy.controller = this.playerSpy;
                    this.returnValue = this.prompt.onCardClicked(this.playerSpy, this.cardSpy); 
                });

                it('should call canDeclareAsAttacker', function() {
                    expect(this.cardSpy.canDeclareAsAttacker).toHaveBeenCalled()
                });

                describe('and it can be declared as an attacker,', function() {
                    beforeEach(function() {
                        this.cardSpy.canDeclareAsAttacker.and.returnValue(true);
                        this.returnValue = this.prompt.onCardClicked(this.playerSpy, this.cardSpy); 
                    });

                    describe('and it\'s not currently participating,', function() {
                        it('should return true', function() {
                            expect(this.returnValue).toBe(true);
                        });

                        it('should call addAttacker', function() {
                            expect(this.conflictSpy.addAttacker).toHaveBeenCalledWith(this.cardSpy);
                        });

                        describe('and it has Covert,', function() {
                            beforeEach(function() {
                                this.cardSpy.isCovert.and.returnValue(true);
                                this.conflictSpy.addAttacker.and.callFake(() => {
                                    this.conflictSpy.attackers = [this.cardSpy];
                                })
                                this.returnValue = this.prompt.onCardClicked(this.playerSpy, this.cardSpy);
                            });

                            it('should set covertRemaining to true', function() {
                                expect(this.prompt.covertRemaining).toBe(true);
                            });
                        });
                    });
                                   
                    describe('and it\'s currently participating,', function() {
                        beforeEach(function() {
                            this.conflictSpy.attackers.push(this.cardSpy);
                            this.returnValue = this.prompt.onCardClicked(this.playerSpy, this.cardSpy); 
                        });

                        it('should call isCovert', function() {
                            expect(this.cardSpy.isCovert).toHaveBeenCalled();
                        });

                        it('should return true', function() {
                            expect(this.returnValue).toBe(true);
                        });

                        it('should call removeFromConflict', function() {
                            expect(this.conflictSpy.removeFromConflict).toHaveBeenCalledWith(this.cardSpy);
                        });

                        describe('and it has covert,', function() {
                            beforeEach(function() {
                                this.cardSpy.isCovert.and.returnValue(true);
                                this.returnValue = this.prompt.onCardClicked(this.playerSpy, this.cardSpy); 
                            });

                            describe('and no covert is remaining', function() {
                                it('should return false', function() {
                                    expect(this.returnValue).toBe(false);
                                });
                            });

                            describe('and covert is remaining', function() {
                                beforeEach(function() {
                                    this.prompt.covertRemaining = true;
                                    this.returnValue = this.prompt.onCardClicked(this.playerSpy, this.cardSpy); 
                                });

                                it('should return true', function() {
                                    expect(this.returnValue).toBe(true);
                                });
        
                                it('should call removeFromConflict', function() {
                                    expect(this.conflictSpy.removeFromConflict).toHaveBeenCalledWith(this.cardSpy);
                                });
                            });
                        });
                    });
                });

                describe('and it can\'t be declared as an attacker,', function() {
                    beforeEach(function() {
                        this.cardSpy.canDeclareAsAttacker.and.returnValue(false);
                    });

                    it('should return false', function() {
                        expect(this.prompt.onCardClicked(this.playerSpy, this.cardSpy)).toBe(false)
                    });
                });
            });

            describe('if the card is controlled by the other player,', function() {
                beforeEach(function() {
                    this.cardSpy.controller = this.opponent;
                    this.cardSpy.canBeBypassedByCovert.and.returnValue(true);
                });

                describe('if the card is currently selected', function() {
                    beforeEach(function() {
                        this.prompt.selectedDefenders.push(this.cardSpy);
                        this.cardSpy.covert = true;
                        this.returnValue = this.prompt.onCardClicked(this.playerSpy, this.cardSpy); 
                    });

                    it('should return true', function() {
                        expect(this.returnValue).toBe(true);
                    });

                    it('should mark the card as no longer coverted', function() {
                        expect(this.cardSpy.covert).toBe(false);
                    });

                    it('should remove the card from selected defenders', function() {
                        expect(this.prompt.selectedDefenders).not.toContain(this.cardSpy);
                    });
                });

                describe('if it cannot be coverted', function() {
                    beforeEach(function() {
                        this.cardSpy.canBeBypassedByCovert.and.returnValue(false);
                    });

                    it('should return false', function() {
                        expect(this.prompt.onCardClicked(this.playerSpy, this.cardSpy)).toBe(false)
                    });
                });

                describe('if there is covert remaining', function() {
                    beforeEach(function() {
                        this.prompt.covertRemaining = true;
                        this.returnValue = this.prompt.onCardClicked(this.playerSpy, this.cardSpy); 
                    });

                    it('should return true', function() {
                        expect(this.returnValue).toBe(true);
                    });

                    it('should mark the card as coverted', function() {
                        expect(this.cardSpy.covert).toBe(true);
                    });

                    it('should add the card to selected defenders', function() {
                        expect(this.prompt.selectedDefenders).toContain(this.cardSpy);
                    });
                });

                it('should return false', function() {
                    expect(this.prompt.onCardClicked(this.playerSpy, this.cardSpy)).toBe(false)
                });          
            });
        });

        describe('when the card is an attachment,', function() {
            beforeEach(function() {
                this.cardSpy.type === 'attachment';
            });

            it('should return false', function() {
                expect(this.prompt.onCardClicked(this.playerSpy, this.cardSpy)).toBe(false)
            });    
        });
    });

    describe('the menuCommand function:', function() {
        beforeEach(function() {
            this.conflictSpy.conflictRing = 'fire';
            this.conflictSpy.conflictType = 'military';
            this.cardSpy = jasmine.createSpyObj('card', ['allowGameAction']);
            this.conflictSpy.conflictProvince = this.cardSpy;
            this.prompt.menuCommand(this.playerSpy, 'done');
        });

        describe('when passed "done"', function() {
            describe('if the conflict type is undefined', function() {
                beforeEach(function() {
                    this.prompt.completed = false;
                    this.conflictSpy.conflictType = '';
                    this.prompt.menuCommand(this.playerSpy, 'done');
                });

                it('should not set complete to true', function() {
                    expect(this.prompt.completed).toBe(false);
                });
            });

            describe('if the conflict ring is undefined', function() {
                beforeEach(function() {
                    this.prompt.completed = false;
                    this.conflictSpy.conflictRing = '';
                    this.prompt.menuCommand(this.playerSpy, 'done');
                });

                it('should not set complete to true', function() {
                    expect(this.prompt.completed).toBe(false);
                });
            });

            describe('if the conflict is not singlePlayer and there is no province selected', function() {
                beforeEach(function() {
                    this.prompt.completed = false;
                    this.conflictSpy.conflictProvince = null;
                    this.prompt.menuCommand(this.playerSpy, 'done');
                });

                it('should not set complete to true', function() {
                    expect(this.prompt.completed).toBe(false);
                });
            });

            describe('if covert is remaining and there is a legal target', function() {
                beforeEach(function() {
                    this.prompt.completed = false;
                    this.prompt.covertRemaining = true;
                    this.opponentSpy = jasmine.createSpyObj('opponent', ['anyCardsInPlay']); 
                    this.opponentSpy.anyCardsInPlay.and.returnValue(true);
                    this.conflictSpy.defendingPlayer = this.opponentSpy;
                    this.prompt.menuCommand(this.playerSpy, 'done');
                });

                it('should not set complete to true', function() {
                    expect(this.prompt.completed).toBe(false);
                });

                it('should prompt the player with a handler menu', function() {
                    expect(this.gameSpy.promptWithHandlerMenu).toHaveBeenCalledWith(this.playerSpy, jasmine.objectContaining({ activePromptTitle: 'You still have unused Covert - are you sure?' }));
                });
            });

            it('should set completed to true', function() {
                expect(this.prompt.completed).toBe(true);
            });
        });

        describe('when passed "pass",', function() {
            beforeEach(function() {
                this.prompt.completed = false;
                this.prompt.menuCommand(this.playerSpy, 'pass');               
            });

            it('should prompt the player with a handler menu', function() {
                expect(this.gameSpy.promptWithHandlerMenu).toHaveBeenCalledWith(this.playerSpy, jasmine.objectContaining({ activePromptTitle: 'Are you sure you want to pass your conflict opportunity?' }));
            });

            it('should not set complete to true', function() {
                expect(this.prompt.completed).toBe(false);
            });
    })
    })
});
