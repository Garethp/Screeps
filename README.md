Overview
=======
This library includes a number of things, the main two of which are the are the **roles** functionality and the **spawner**.
The spawner mainly uses what is known as a role to make human readable aliases to spawn off of, as well as containing some
methods to help managing the spawner. The roles are a set of classes that are made to be sharable between projects, so if
you want to share your particular body parts config, or the ai, for a role with someone else, it should be easy to simply
plug and play.

Spawner
=======
The spawner module has 4 methods for use. These are

 - spawn(role, memory)
 - canSpawn(spawnPoint, role)
 - spawnCost(role)
 - killAll()
 
The **role** argument here refers to a associative array in the roles.js file, where role is a key to an array of body parts.
The role also directly relates to the AI for that role in the file roles_{roleName}. So if you spawn a creep with the role
of "miner" it's AI code will be located in roles_miner.js, though this is handled by performRoles.js

Roles
=====
To make things simple, I've split each role up into it's own file, and role.js simply contains a list of the roles and their
body parts (though in the future the list of body parts will be moved to the file for that role). This means that it should
be relatively easy to simply add a new role without making your code for running a turn any more complicated, as the rest of the code
will simply take the new role into account.

Each role in this codebase extends from the role_prototype.js code, for some shared functionality. This functionality includes
some events which you can handle. So far the code supports handling the following events:

 - onSpawn() *This is called when the spawner has started spawning*
 - onSpawnStart() *This is called when the spawner has started spawning*
 - onSpawnEnd() *This is called when the creep has finished spawning*
 - beforeAge *This is called when the creep has one tick left*
 
And the main AI code should go into the

 - performAction(creep)
 
method.