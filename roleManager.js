module.exports = {
	roleExists: function(role){
		try
		{
			require("roles_" + role);
			return true;
		}
		catch(e)
		{
			return false;
		}
	},

	getRole: function(role)
	{
		if(!this.roleExists(role))
			return false;

		var roleObject = require("roles_" + role);
		return roleObject;
	},

	getRoleBodyParts: function(role)
	{
		if(!this.roleExists(role))
			return false;

		var role = this.getRole(role);
		return role.prototype.getParts.call(role);
	}
};