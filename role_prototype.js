var proto = function()
{

};

proto.prototype.init = function(creep)
{
	this.creep = creep;
};

proto.prototype.run = function()
{
	if(this.creep.memory.onSpawned == undefined) {
		this.onSpawn();
		this.creep.memory.onSpawned = true;
	}

	this.performAction(this.creep);

	if(this.creep.ticksToLive == 1)
		this.beforeAge();
};

proto.prototype.handleEvents = function()
{
	if(this.creep.memory.onSpawned == undefined) {
		this.onSpawnStart();
		this.onSpawn();
		this.creep.memory.onSpawned = true;
	}

	if(this.creep.memory.onSpawnEnd == undefined && !this.creep.spawning) {
		this.onSpawnEnd();
		this.creep.memory.onSpawnEnd = true;
	}
};

proto.prototype.onSpawn = function()
{
};

proto.prototype.getParts = function()
{
	var _ = require('lodash');

	var extensions = Game.getRoom('1-1').find(Game.MY_STRUCTURES, {
		filter: function(structure)
		{
			return (structure.structureType == Game.STRUCTURE_EXTENSION && structure.energy >= 200);
		}
	}).length;

	var parts = _.cloneDeep(this.parts);
	if(typeof parts[0] != "object")
		return this.parts;

	parts.reverse();

	for(var i in parts)
	{
		if((parts[i].length - 5) <= extensions) {
			return parts[i];
		}
	}
};

proto.prototype.performAction = function()
{

};

proto.prototype.onSpawnStart = function()
{

};

proto.prototype.onSpawnEnd = function()
{

};

proto.prototype.beforeAge = function()
{

};

/**
 * All credit goes to Djinni
 * @url https://bitbucket.org/Djinni/screeps/
 */
proto.prototype.fightMethods = {
	rest: function(creep) {
		var distance = 4;
		if (creep.getActiveBodyparts(Game.HEAL)) {
			distance = distance - 2
		}
		else if (creep.getActiveBodyparts(Game.RANGED_ATTACK)) {
			distance = distance - 1;
		}
		if (creep.pos.findPathTo(Game.spawns.Spawn1).length > distance) {
			creep.moveTo(Game.spawns.Spawn1);
		}
	},

	rangedAttack: function(creep) {
		var target = creep.pos.findNearest(Game.HOSTILE_CREEPS)
		if(target) {
			if (target.pos.inRangeTo(creep.pos, 3) ) {
				creep.rangedAttack(target);
				return target;
			}
		}
		return null;
	},

	keepAwayFromEnemies: function(creep)
	{
		var target = creep.pos.findNearest(Game.HOSTILE_CREEPS);
		if(target !== null && target.pos.inRangeTo(creep.pos, 3))
			creep.moveTo(creep.pos.x + creep.pos.x - target.pos.x, creep.pos.y + creep.pos.y - target.pos.y );
	},

	kite: function(creep, target) {
		if (target.pos.inRangeTo(creep.pos, 2)) {
			creep.moveTo(creep.pos.x + creep.pos.x - target.pos.x, creep.pos.y + creep.pos.y - target.pos.y );
			return true;
		} else if (target.pos.inRangeTo(creep.pos, 3)) {
			return true;
		}
		return false;
	},

	targetEnemy: function(creep)
	{
		var nearestArcher = creep.pos.findNearest(Game.HOSTILE_CREEPS, {
			filter: function(enemy)
			{
				return enemy.getActiveBodyparts(Game.RANGED_ATTACK) > 0;
			}
		});

		if(nearestArcher != null)
			return nearestArcher;

		var nearestMobileMelee = creep.pos.findNearest(Game.HOSTILE_CREEPS, {
			filter: function(enemy)
			{
				return enemy.getActiveBodyparts(Game.ATTACK) > 0
					&& enemy.getActiveBodyparts(Game.MOVE) > 0;
			}
		});

		if(nearestMobileMelee != null)
			return nearestMobileMelee;

		var nearestHealer = creep.pos.findNearest(Game.HOSTILE_CREEPS, {
			filter: function(enemy)
			{
				return enemy.getActiveBodyparts(Game.HEAL) > 0
					&& enemy.getActiveBodyparts(Game.MOVE) > 0;
			}
		});

		if(nearestHealer != null)
			return nearestHealer;

		return creep.pos.findNearest(Game.HOSTILE_CREEPS);
	}
};

module.exports = proto;