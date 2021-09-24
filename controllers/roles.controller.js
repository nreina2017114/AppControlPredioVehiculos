const chalk = require("chalk");
const RoleModel = require("../models/roles.model");

const DEFAULT_ROLES = [
  { name: "ADMIN", description: "Administrator user", roleKey: 1 },
  { name: "BUYER", description: "Buyer user", roleKey: 2 },
  { name: "SELLER", description: "Seller user", roleKey: 3 },
];

async function createRoles() {
  try {
    const storedRoles = await getRoles();

    if (storedRoles.length) {
      console.log("USER ROLES ALREADY EXISTS - SKIPPING CREATION");
      return;
    }

    const userRoles = await Promise.all(
      DEFAULT_ROLES.map((roleData) => {
        const roleModel = RoleModel(roleData);
        return roleModel.save();
      })
    );

    if (userRoles.length) console.log(`USER ROLES CREATED`);
  } catch (error) {
    console.log(chalk.red(`ERROR TRYING TO CREATE USER ROLES`));
  }
}

async function getRoles() {
  try {
    const roles = await RoleModel.find({});
    return roles;
  } catch (error) {
    console.log(chalk.red(error.message));
  }
}

async function getRole(roleKey) {
  try {
    const roles = await RoleModel.find({ roleKey });

    if (!roles) return null;

    const roleFound = roles.shift();
    return roleFound;
  } catch (error) {
    return null;
  }
}

module.exports = { 
    createRoles, 
    getRole

};