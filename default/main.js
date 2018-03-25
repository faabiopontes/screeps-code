var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleMiner = require('role.miner');
var roleWallRepairer = require('role.wallRepairer');
var roleLongDistanceBuilderUpgrader = require('role.longDistanceBuilderUpgrader');
require('prototype.creep');

module.exports.loop = function () {
    const FSP_PERCENTAGE_TO_REPAIR = 0.3;

    var harvesterCount = 0;
    var upgraderCount = 0;
    var builderCount = 0;
    var repairerCount = 0;
    var wallRepairerCount = 0;
    var minerCount = 0;
    var longDistanceBuilderUpgraderCount = 0;
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

    var lowestStructureToRepair = Game.rooms['E53N59'].find(FIND_STRUCTURES, {
        filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_CONTROLLER
    }).sort(function (a, b) {
        return a.hits - b.hits;
    });
    var hitsPercentage = lowestStructureToRepair[0].hits / lowestStructureToRepair[0].hitsMax;

    var mineSource = 0;
    // when sources regenerate
    // recalc where creeps should mine
    // make a find on the source, taking the closest creeps
    // change the source of them
    // change the source on the others as well
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

        if (creep.memory.role == 'longDistanceBuilderUpgrader') {
            roleLongDistanceBuilderUpgrader.run(creep);
            longDistanceBuilderUpgraderCount++;
        }
    }

    sources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
    // console.log(JSON.stringify(sources,undefined,2));

    console.log(
        "E: " + energyAvailable + "/" + energyCapacity,
        "H: " + harvesterCount + " (" + countHarvestSource0 + "/" + countHarvestSource1 + ") (" + harvesterTicksToLive + ")",
        "U: " + upgraderCount + " (" + countMineSource0 + "/" + countMineSource1 + ")",
        "B: " + builderCount,
        "R: " + repairerCount,
        "WP: " + wallRepairerCount,
        "LDBU: " + longDistanceBuilderUpgraderCount,
        "Controller: (" + Game.spawns['Spawn1'].room.controller.progress + "/" + Game.spawns['Spawn1'].room.controller.progressTotal + ")",
        "Sources: (energy/ticks)",
        "(" + sources[0].energy + "/" + (sources[0].ticksToRegeneration ? sources[0].ticksToRegeneration : 300) + ")",
        "(" + sources[1].energy + "/" + (sources[1].ticksToRegeneration ? sources[1].ticksToRegeneration : 300) + ")",
    );

    if (Game.spawns['Spawn1'].energy > 199 && Game.spawns['Spawn1'].room.controller.ticksToDowngrade < 300) {
        Game.notify("Controller almost downgrading!");
        Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], undefined, { role: 'upgrader' });
    }

    if (energyAvailable > 299 && harvesterCount < 1) {
        Game.notify("We don't have any Harvester!");
        Game.spawns['Spawn1'].createCreep([WORK, WORK, CARRY, MOVE], undefined, {
            role: 'harvester',
            harvestSource: 1
        });
    }

    if (energyAvailable > 849) {
        var parts = [
            WORK, WORK, WORK, WORK, WORK,
            CARRY,
            MOVE, MOVE, MOVE
        ];

        var role = '';
        // var wallsToRepair = false;
        if (
            harvesterCount < 2 ||
            (harvesterCount == 2 && harvesterTicksToLive < 200)
        ) {
            role = 'harvester';
        }
        else if (
            repairerCount < 1 &&
            hitsPercentage <= FSP_PERCENTAGE_TO_REPAIR
        ) {
            parts.push(MOVE, CARRY, CARRY);
            role = 'repairer';
        }
        else if (builderCount < 2 && numberConstructionSites > 0) {
            role = 'builder';
        }
        // else if (wallRepairerCount == 0) {
        //     role = 'wallRepairer';
        // }
        else if (upgraderCount < 2) {
            if (!(countMineSource1 >= countMineSource0)) {
                parts.push(MOVE, CARRY, CARRY);
            }
            // else {
            role = 'upgrader';
        }
        else if (
            longDistanceBuilderUpgraderCount < 3
        ) {
            parts.push(MOVE, CARRY, CARRY);
            role = 'longDistanceBuilderUpgrader';
        }

        if (role != '') {
            Game.spawns['Spawn1'].createCreep(
                parts,
                undefined,
                {
                    role: role,
                    working: false,
                    mineSource: (countMineSource1 >= countMineSource0) ? 0 : 1,
                    source: builderContainerNotFound ? 0 : 1,
                    harvestSource: (countHarvestSource0 >= countHarvestSource1) ? 1 : 0,
                    home: "E53N59",
                    target: "E54N59"
                }
            );
        }
    }

    // console.log(JSON.stringify(Game.spawns['Spawn1'].room.controller,undefined,2));
}