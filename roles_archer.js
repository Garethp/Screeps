var proto = require('role_prototype');

var archer = function()
{

};

archer.prototype = Object.create(proto.prototype);
archer.performAction = function()
{
	var creep = this.creep;

	var closestEnemy = creep.pos.findNearest(Game.HOSTILE_CREEPS);

	if(closestEnemy !== undefined)
	{
		creep.moveTo(closestEnemy, {
			withinRampartsOnly: true
		});

		creep.rangedAttack(closestEnemy);
	}
};

module.exports = archer;