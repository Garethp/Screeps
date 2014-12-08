/**
 * Because shit happens
 * @param creep
 */
var proto = require('role_prototype');

var healer = {
	parts: [
		[Game.MOVE, Game.MOVE, Game.HEAL, Game.HEAL],
		[Game.MOVE, Game.MOVE, Game.MOVE, Game.HEAL, Game.HEAL, Game.HEAL]
	],

	action: function()
	{
		var creep = this.creep;
		var needsHealing = [ ];

		this.keepAwayFromEnemies();

		//Find my creeps that are hurt. If they're hurt, heal them.
		//If there aren't any hurt, we're going to try and get the healers
		//to tick near the guards, so that they're close by when the battle starts
		var target = creep.pos.findNearest(Game.MY_CREEPS, {
			filter: function(t)
			{
				return t.hits < t.hitsMax
			}
		});

		if(target)
		{
			creep.moveTo(target);
			creep.heal(target);
		}
		else {
			this.rest();
		}
	}
};

module.exports = healer;