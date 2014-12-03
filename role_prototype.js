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
};

proto.prototype.onSpawn = function()
{
};

proto.prototype.performAction = function()
{

};

module.exports = proto;