// generate-hash.js
const bcrypt = require('bcrypt');

async function main() {
    const passwords = ['Veenus111!'];
    
    for (const p of passwords) {
        const hash = await bcrypt.hash(p, 10);
        console.log(`${p} → ${hash}`);
    }
}

main();