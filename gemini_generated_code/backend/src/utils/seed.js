const { getDb, initializeDatabase } = require('./db');
const { technicalLogger } = require('./logger');
const { v4: uuidv4 } = require('uuid');

const legoSets = [
    { name: "Millennium Falcon", category: "Star Wars", price: 1599.99, stock: 10 },
    { name: "Hogwarts Castle", category: "Harry Potter", price: 3999.99, stock: 5 },
    { name: "Death Star", category: "Star Wars", price: 4999.99, stock: 3 },
    { name: "The Disney Castle", category: "Disney", price: 3499.99, stock: 8 },
    { name: "Colosseum", category: "Creator Expert", price: 5499.99, stock: 4 },
    { name: "Titanic", category: "Creator Expert", price: 6299.99, stock: 2 },
    { name: "Batmobile Tumbler", category: "DC Comics", price: 2299.99, stock: 7 },
    { name: "The Globe", category: "Ideas", price: 1999.99, stock: 12 },
    { name: "Typewriter", category: "Ideas", price: 1999.99, stock: 9 },
    { name: "Home Alone", category: "Ideas", price: 2499.99, stock: 6 },
    { name: "Seinfeld", category: "Ideas", price: 799.99, stock: 15 },
    { name: "Friends Apartments", category: "Ideas", price: 1499.99, stock: 11 },
    { name: "The Starry Night", category: "Ideas", price: 1699.99, stock: 10 },
    { name: "Eiffel Tower", category: "Creator Expert", price: 6299.99, stock: 3 },
    { name: "Lamborghini Sián FKP 37", category: "Technic", price: 3799.99, stock: 5 },
    { name: "Ferrari Daytona SP3", category: "Technic", price: 3999.99, stock: 4 },
    { name: "Porsche 911 RSR", category: "Technic", price: 1499.99, stock: 8 },
    { name: "Bugatti Chiron", category: "Technic", price: 3499.99, stock: 6 },
    { name: "The Mighty Bowser", category: "Super Mario", price: 2699.99, stock: 7 },
    { name: "Nintendo Entertainment System", category: "Super Mario", price: 2299.99, stock: 9 },
    { name: "Question Mark Block", category: "Super Mario", price: 1699.99, stock: 12 },
    { name: "The Razor Crest", category: "Star Wars", price: 5999.99, stock: 2 },
    { name: "AT-AT", category: "Star Wars", price: 7999.99, stock: 1 },
    { name: "Republic Gunship", category: "Star Wars", price: 3499.99, stock: 5 },
    { name: "Imperial Star Destroyer", category: "Star Wars", price: 6999.99, stock: 2 },
    { name: "Diagon Alley", category: "Harry Potter", price: 3999.99, stock: 6 },
    { name: "Hogwarts Express - Collectors' Edition", category: "Harry Potter", price: 4999.99, stock: 4 },
    { name: "The Ministry of Magic", category: "Harry Potter", price: 999.99, stock: 10 },
    { name: "12 Grimmauld Place", category: "Harry Potter", price: 1299.99, stock: 8 },
    { name: "Hogwarts Chamber of Secrets", category: "Harry Potter", price: 1299.99, stock: 7 },
    { name: "The Batman - Batmobile", category: "DC Comics", price: 999.99, stock: 11 },
    { name: "Batwing 1989", category: "DC Comics", price: 1999.99, stock: 9 },
    { name: "The Daily Bugle", category: "Marvel", price: 2999.99, stock: 5 },
    { name: "Sanctum Sanctorum", category: "Marvel", price: 2149.99, stock: 7 },
    { name: "The Guardians' Ship", category: "Marvel", price: 1499.99, stock: 10 },
    { name: "Thor's Hammer", category: "Marvel", price: 999.99, stock: 12 },
    { name: "Infinity Gauntlet", category: "Marvel", price: 699.99, stock: 15 },
    { name: "Bonsai Tree", category: "Botanical Collection", price: 499.99, stock: 20 },
    { name: "Flower Bouquet", category: "Botanical Collection", price: 499.99, stock: 18 },
    { name: "Orchid", category: "Botanical Collection", price: 499.99, stock: 16 },
    { name: "Succulents", category: "Botanical Collection", price: 499.99, stock: 17 },
    { name: "Bird of Paradise", category: "Botanical Collection", price: 999.99, stock: 14 },
    { name: "Camp Nou – FC Barcelona", category: "Creator Expert", price: 3499.99, stock: 6 },
    { name: "Real Madrid – Santiago Bernabéu Stadium", category: "Creator Expert", price: 3499.99, stock: 6 },
    { name: "Ford Mustang", category: "Creator Expert", price: 1399.99, stock: 9 },
    { name: "Volkswagen T2 Camper Van", category: "Creator Expert", price: 1599.99, stock: 8 },
    { name: "Ghostbusters ECTO-1", category: "Creator Expert", price: 1999.99, stock: 7 },
    { name: "Assembly Square", category: "Modular Buildings", price: 2799.99, stock: 5 },
    { name: "Boutique Hotel", category: "Modular Buildings", price: 1999.99, stock: 8 },
    { name: "Police Station", category: "Modular Buildings", price: 1999.99, stock: 7 }
];

async function seedDatabase() {
  await initializeDatabase();
  const db = getDb();

  const insertProduct = db.prepare(`INSERT OR REPLACE INTO products (id, name, description, price, imageUrl, category, stock) VALUES (?, ?, ?, ?, ?, ?, ?)`);

  legoSets.forEach(set => {
    const id = uuidv4();
    const description = `An amazing Lego set from the ${set.category} series. Build and display the iconic ${set.name}.`;
    const imageUrl = `/images/products/${set.name.toLowerCase().replace(/ /g, '-')}.jpg`;
    insertProduct.run(id, set.name, description, set.price, imageUrl, set.category, set.stock);
  });

  insertProduct.finalize((err) => {
    if (err) {
      technicalLogger.error('Error seeding products:', err.message);
    } else {
      technicalLogger.info('Database seeded with 50 products.');
    }
    db.close((err) => {
      if (err) {
        technicalLogger.error('Error closing database:', err.message);
      }
    });
  });
}

seedDatabase();
