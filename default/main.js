var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleMiner = require('role.miner');
var roleWallRepairer = require('role.wallRepairer');
require('prototype.creep');

module.exports.loop = function () {
    var harvesterCount = 0;
    var upgraderCount = 0;
    var builderCount = 0;
    var repairerCount = 0;
    var wallRepairerCount = 0;
    var minerCount = 0;
    var countMineSource0 = 0;
    var countMineSource1 = 0;
    var countHarvestSource0 = 0;
    var countHarvestSource1 = 0;
    var builderContainerNotFound = true;
    var room = "E53N59";
    var energyAvailable = Game.rooms[room].energyAvailable;
    var energyCapacity = Game.rooms[room].energyCapacityAvailable;
    var numberConstructionSites = Game.rooms[room].find(FIND_MY_CONSTRUCTION_SITES).length;
    var harvesterTicksToLive = 0;

    var mineSource = 0;
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
            harvesterCount++;

            if (creep.ticksToLive < harvesterTicksToLive || harvesterTicksToLive == 0) {
                harvesterTicksToLive = creep.ticksToLive;
            }

            if (creep.memory.harvestSource == 0) {
                countHarvestSource0++;
            }
            if (creep.memory.harvestSource == 1) {
                countHarvestSource1++;
            }
        }
        if (creep.memory.role == 'miner') {
            roleMiner.run(creep);
            minerCount++;
        }
        if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
            repairerCount++;
        }
        if (creep.memory.role == 'wallRepairer') {
            roleWallRepairer.run(creep);
            wallRepairerCount++;
        }
        if (creep.memory.role == 'upgrader') {

            roleUpgrader.run(creep);
            upgraderCount++;

            if (creep.memory.mineSource == 0) {
                countMineSource0++;
            }
            if (creep.memory.mineSource == 1) {
                countMineSource1++;
            }
        }

        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
            builderCount++;
        }
    }

    console.log(
        "E: " + energyAvailable + "/" + energyCapacity,
        "H: " + harvesterCount + " (" + countHarvestSource0 + "/" + countHarvestSource1 + ")",
        "U: " + upgraderCount + " (" + countMineSource0 + "/" + countMineSource1 + ")",
        "B: " + builderCount,
        "R: " + repairerCount,
        "WP: " + wallRepairerCount
    );

    if (Game.spawns['Spawn1'].energy > 199 && Game.spawns['Spawn1'].room.controller.ticksToDowngrade < 300) {
        Game.notify("Controller almost downgrading!");
        Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], undefined, { role: 'upgrader' });
    }

    if (energyAvailable > 199 && harvesterCount < 1) {
        Game.notify("We don't have any Harvester!");
        Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], undefined, {
            role: 'harvester',
            harvestSource: 1
        });
    }

    if (energyAvailable > 699) {
        var role = '';
        // var wallsToRepair = false;
        if (
            harvesterCount < 2 ||
            (harvesterCount == 2 && harvesterTicksToLive < 100)
        ) {
            role = 'harvester';
        }
        // else if (repairerCount < 1) {
        //     role = 'repairer';
        // }
        else if (builderCount < 1 && numberConstructionSites > 0) {
            role = 'builder';
        }
        // else if (wallRepairerCount == 0) {
        //     role = 'wallRepairer';
        // }
        // else if (upgraderCount < 11) {
        else {
            role = 'upgrader';
        }
        Game.spawns['Spawn1'].createCreep(
            [
                WORK, WORK, WORK, WORK, WORK,
                CARRY,
                MOVE, MOVE, MOVE
            ], undefined, {
                role: role,
                working: false,
                mineSource: (countMineSource0 >= countMineSource1) ? 1 : 0,
                source: builderContainerNotFound ? 0 : 1,
                harvestSource: (countHarvestSource0 >= countHarvestSource1) ? 1 : 0
            });
    }

    console.log("harvesterTicksToLive", harvesterTicksToLive);
    // console.log("builderContainerNotFound: ",builderContainerNotFound);
}