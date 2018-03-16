var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleMiner = require('role.miner');
require('prototype.creep');

module.exports.loop = function () {
    var harvesterCount = 0;
    var upgraderCount = 0;
    var builderCount = 0;
    var repairerCount = 0;
    var minerCount = 0;
    var builderContainerNotFound = true;
    var room = "W31S46";
    var energyAvailable = Game.rooms[room].energyAvailable;
    var energyCapacityAvailable = Game.rooms[room].energyCapacityAvailable;
    var numberConstructionSites = Game.rooms[room].find(FIND_MY_CONSTRUCTION_SITES).length;

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
            harvesterCount++;
        }
        if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
            minerCount++;
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
            repairerCount++;
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
            upgraderCount++;
            
            // roleBuilder.run(creep);
            // builderCount++;
        }
        
        if(creep.memory.role == 'builder') {
            if(creep.memory.source == 0) {
                builderContainerNotFound = false;
            }
            roleBuilder.run(creep);
            builderCount++;
        }
    }
    
    console.log(
        "Energy: "+energyAvailable+"/"+energyCapacityAvailable,
        "Harvesters: "+harvesterCount,
        "Upgraders: "+upgraderCount,
        "Builders: "+builderCount,
        "Repairers: ",+repairerCount
    );
    
    // if(energyAvailable >= 200 && harvesterCount < 1) {
    //     Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'})
    // }
    
    if(Game.spawns['Spawn1'].energy > 199 && Game.getObjectById("59f1a11082100e1594f37b35").ticksToDowngrade < 300) {
        Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'})
    }
        
    
    if(energyAvailable > 549) {
        var role = '';
        if(harvesterCount < 2) {
            role = 'harvester';
        } else if (repairerCount < 1) {
            role = 'repairer';
        }
        // else if (builderCount == 2 && numberConstructionSites > 0) {
        //     role = 'builder';
        // }
        else {
            role = 'upgrader';
        }
        Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], undefined, {role: role, working: false, source: builderContainerNotFound ? 0 : 1});
    }
    
    console.log("builderContainerNotFound: ",builderContainerNotFound);
}