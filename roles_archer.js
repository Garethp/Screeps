module.exports = function(creep)
{
	var closestEnemy = creep.pos.findNearest(Game.HOSTILE_CREEPS);

	if(closestEnemy !== undefined)
	{
		creep.moveTo(closestEnemy, {
			withinRampartsOnly: true
		});

		creep.rangedAttack(closestEnemy);
	}
}