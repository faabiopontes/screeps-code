var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {
        //creep.say("U");
        // console.log("storage", creep.room.storage);
        var signText = "I just learned how to do this! Have mercy!";

        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('🚧 upgrading');
        }

        if (!creep.memory.upgrading) {
            // const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            // if (target) {
            //     if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(target);
            //     }
            // } else {
            var sources = creep.room.find(FIND_SOURCES);
            var returnHarvest = creep.harvest(sources[creep.memory.mineSource]);
            if (returnHarvest == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.mineSource], { visualizePathStyle: { stroke: '#900' } });
            } else if (returnHarvest == ERR_NOT_ENOUGH_RESOURCES || returnHarvest == ERR_NO_PATH) {
                // sourceActive = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                // check if we can use id on the return
                // save id on the memory of the creep instead
                if (creep.memory.home == 'E54N59') {
                    return;
                }
                creep.memory.mineSource = (creep.memory.mineSource == 1) ? 0 : 1;
            }
            // if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            // creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#900' } });
            // }
            // }
        }
        else {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#900' } });
            }
            // move to controller anyway
            if (creep.room == 'E53N59') {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#900' } });
            }

        }
        // remove fixed String in future
        if (creep.room.name != creep.memory.home) {
            console.log("OUTSIDE ROOM " + creep.memory.home, creep.name);
            // find exit to home room
            var exit = creep.room.findExitTo(creep.memory.home);
            // and move to exit
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
        if (creep.room.controller.sign != undefined) {
            if (creep.room.controller.sign.text != signText) {
                if (creep.signController(creep.room.controller, signText) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }
};

module.exports = roleUpgrader;