import os from "node:os";

const interfaces = os.networkInterfaces();
const addresses = Object.values(interfaces)
  .flat()
  .filter((entry) => entry && entry.family === "IPv4" && !entry.internal)
  .map((entry) => entry.address);

if (!addresses.length) {
  console.log("No LAN IPv4 address found. Use http://localhost:3000 on this machine.");
  process.exit(0);
}

console.log("PlayerMaster local CMS URLs:");
for (const address of addresses) {
  console.log(`  http://${address}:3000`);
}
