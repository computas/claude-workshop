import { Database } from "better-sqlite3";

export function seedData(db: Database) {
  const products = [
    { name: "Lego Star Wars Millennium Falcon", price: 1599, category: "Star Wars", description: "The iconic Corellian freighter.", image_url: "https://picsum.photos/seed/lego1/400/300" },
    { name: "Lego Technic Bugatti Chiron", price: 2999, category: "Technic", description: "A masterpiece of engineering.", image_url: "https://picsum.photos/seed/lego2/400/300" },
    { name: "Lego City Police Station", price: 899, category: "City", description: "Keep the city safe.", image_url: "https://picsum.photos/seed/lego3/400/300" },
    { name: "Lego Harry Potter Hogwarts Castle", price: 2499, category: "Harry Potter", description: "The magical school of witchcraft and wizardry.", image_url: "https://picsum.photos/seed/lego4/400/300" },
    { name: "Lego Creator Expert Ford Mustang", price: 1299, category: "Creator", description: "Classic American muscle car.", image_url: "https://picsum.photos/seed/lego5/400/300" },
    // ... adding more to reach 50
  ];

  // Generate 45 more products to reach 50
  const categories = ["Star Wars", "Technic", "City", "Harry Potter", "Creator", "Ninjago", "Friends", "Architecture"];
  for (let i = 6; i <= 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    products.push({
      name: `Lego ${category} Set #${i}`,
      price: Math.floor(Math.random() * (3000 - 100 + 1)) + 100,
      category: category,
      description: `An amazing ${category} set for builders of all ages.`,
      image_url: `https://picsum.photos/seed/lego${i}/400/300`
    });
  }

  const insert = db.prepare("INSERT INTO products (name, price, category, description, image_url) VALUES (?, ?, ?, ?, ?)");
  
  const insertMany = db.transaction((items) => {
    for (const item of items) insert.run(item.name, item.price, item.category, item.description, item.image_url);
  });

  insertMany(products);
}
