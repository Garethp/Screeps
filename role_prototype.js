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