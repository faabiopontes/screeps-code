var roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {
        creep.say("B");

        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            // build container faster
            // if(creep.memory.source === 0) {
            //     var target = creep.room.find(FIND_MY_CONSTRUCTION_SITES).filter(function(constructionSite) { return constructionSite.id == "5aa73e66999fff5239f52673"});
            //     if(typeof target != "undefined") {
            //         target = target[0];
            //     } else {
            //         target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
            //     }
            // }
            // else {
            var target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
            // }
            // console.log(JSON.stringify(target));
            // console.log("BuildER)")
            // console.log(target);
            if (target) {
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#009' } });
                }
            }
        }
        else {
            // var closestSource = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            // if (creep.harvest(closestSource) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(closestSource, { visualizePathStyle: { stroke: '#009' } });
            // }
            var closestSource = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            // console.log("Builder Sources");
            // console.log(JSON.stringify(closestSource));
            if (creep.harvest(closestSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestSource, { visualizePathStyle: { stroke: '#009' } });
            }
        }
    }
};

module.exports = roleBuilder;