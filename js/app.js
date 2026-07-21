function getCurrentBarbershop() {

    return DATABASE.barbershops[0];

}

const shop = getCurrentBarbershop();

console.log(shop);
console.log(shop.name);
console.log(shop.phone);
console.log(shop.address);