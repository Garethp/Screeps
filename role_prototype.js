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

	console.log('Not Found');
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

module.exports = proto;