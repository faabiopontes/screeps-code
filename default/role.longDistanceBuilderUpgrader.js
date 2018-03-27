module.exports = {
    // a function to run the logic for this role
    /** @param {Creep} creep */
    run: function (creep) {
        creep.memory.target = "E54N59";

        creep.say('LGBU');
        // if creep is bringing energy to a structure but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.upgrading = false;
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
            creep.memory.upgrading = false;
        }

        // if creep is supposed to transfer energy to a structure
        if (creep.memory.working == true) {
            // if in home room
            if (creep.room.name == creep.memory.target && !creep.memory.upgrading) {
                var target = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
                if (target) {
                    if (creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, { visualizePathStyle: { stroke: '#009' } });
                    }
                }
                // if we don't find any construction sites
                // time to upgrade Controller in another room
                else {
                    creep.memory.upgrading = true;
                    this.goTo(creep, creep.memory.home);
                }
            }
            // if not in home room...
            else if (creep.room.name == creep.memory.target && creep.memory.upgrading) {
                this.goTo(creep, creep.memory.home);
            }
            else if (creep.room.name == creep.memory.home && creep.memory.upgrading) {
                var target = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
                if (target) {
                    if (creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, { visualizePathStyle: { stroke: '#009' } });
                    }
                } else {
                    // since we are in our home
                    // we can simply call the code to upgrade the controller
                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(23, 30, { visualizePathStyle: { stroke: '#900' } });
                    }
                }
            }
            else {
                this.goTo(creep, creep.memory.target);
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            // if in target room
            if (creep.room.name == creep.memory.target) {
                // find source
                var source = creep.pos.findClosestByPath(FIND_SOURCES);

                // try to harvest energy, if the source is not in range
                var result = creep.harvest(source);
                console.log(result);
                if (result == ERR_NOT_IN_RANGE) {
                    // move towards the source
                    creep.moveTo(source);
                } else if (result == ERR_NOT_OWNER) {
                    Game.notify("WE CAN'T MINE A ROOM WITH A OWNER!");
                }
            }
            // if not in target room
            else {
                // find exit to target room
                var exit = creep.room.findExitTo(creep.memory.target);
                // console.log("exit", exit);
                // move to exit
                creep.moveTo(creep.pos.findClosestByPath(exit));
            }
        }
    },
    goTo: function (creep, room) {
        var exit = creep.room.findExitTo(room);
        creep.moveTo(creep.pos.findClosestByPath(exit));
    }
};