-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  image_url TEXT,
  category TEXT,
  age_range TEXT,
  piece_count INTEGER,
  in_stock INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'canceled', 'awaiting_return', 'returned')),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  shipping_address_line1 TEXT NOT NULL,
  shipping_address_line2 TEXT,
  shipping_city TEXT NOT NULL,
  shipping_zip TEXT NOT NULL,
  shipping_country TEXT NOT NULL,
  invoice_address_line1 TEXT NOT NULL,
  invoice_address_line2 TEXT,
  invoice_city TEXT NOT NULL,
  invoice_zip TEXT NOT NULL,
  invoice_country TEXT NOT NULL,
  total_amount REAL NOT NULL,
  payment_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  order_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'refunded')),
  payment_method TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- ============================================================
-- 50 Sample LEGO Products (prices in NOK, 100-3000)
-- ============================================================

-- City (1-5)
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO City Police Station', 'A fully equipped police station with jail cells, a police car, and a helicopter. Includes 6 minifigures and a police dog for exciting crime-fighting adventures.', 899, '/images/products/product-1.jpg', 'City', '6+', 743);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO City Airport Terminal', 'Build a bustling airport terminal with check-in counter, luggage carousel, and control tower. Comes with a passenger plane and 8 minifigures.', 1299, '/images/products/product-2.jpg', 'City', '8+', 1036);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO City Fire Station', 'A modern fire station with a garage for the fire truck, a watch tower, and living quarters. Includes 4 firefighter minifigures and accessories.', 649, '/images/products/product-3.jpg', 'City', '6+', 509);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO City Hospital', 'A three-story hospital building with ambulance, helicopter pad, and medical equipment. Features 12 minifigures including doctors and patients.', 1099, '/images/products/product-4.jpg', 'City', '8+', 816);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO City Shopping Mall', 'A vibrant shopping mall with multiple stores, food court, and escalators. Includes 10 minifigures and tons of shopping accessories.', 999, '/images/products/product-5.jpg', 'City', '8+', 892);

-- Technic (6-10)
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Technic Lamborghini Revuelto', 'An incredibly detailed 1:8 scale replica of the Lamborghini Revuelto supercar. Features opening doors, working steering, and a detailed V12 engine.', 2799, '/images/products/product-6.jpg', 'Technic', '18+', 3696);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Technic CAT Excavator', 'A fully functional CAT excavator with pneumatic controls. Features realistic digging motion, rotating cab, and extending arm.', 1599, '/images/products/product-7.jpg', 'Technic', '12+', 2032);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Technic Liebherr Crane', 'The ultimate construction vehicle with motorized functions. Features telescopic boom, outriggers, and a detailed operator cabin.', 2499, '/images/products/product-8.jpg', 'Technic', '12+', 2883);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Technic Land Rover Defender', 'A detailed recreation of the iconic Land Rover Defender with working suspension, steering, and winch. Perfect for off-road adventure fans.', 1399, '/images/products/product-9.jpg', 'Technic', '12+', 2573);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Technic Ducati Panigale V4R', 'A beautifully crafted model of the Ducati Panigale V4R motorcycle featuring a working gearbox, steering, suspension, and exhaust pipes.', 499, '/images/products/product-10.jpg', 'Technic', '10+', 646);

-- Star Wars (11-15)
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Star Wars Millennium Falcon', 'The legendary Millennium Falcon in stunning detail. Features rotating turrets, opening cockpit, and interior compartments with 7 minifigures.', 1699, '/images/products/product-11.jpg', 'Star Wars', '12+', 1353);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Star Wars AT-AT Walker', 'An imposing AT-AT Imperial Walker with posable legs, opening cockpit, and deployable speeder bikes. Includes 6 minifigures.', 1499, '/images/products/product-12.jpg', 'Star Wars', '12+', 1267);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Star Wars Boba Fett Starship', 'Boba Fett iconic Slave I starship with rotating cockpit and hidden weapons. Includes Boba Fett and Han Solo in carbonite.', 449, '/images/products/product-13.jpg', 'Star Wars', '10+', 593);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Star Wars X-Wing Starfighter', 'Luke Skywalker classic X-Wing with opening wings, retractable landing gear, and spring-loaded shooters. Includes Luke and R2-D2.', 599, '/images/products/product-14.jpg', 'Star Wars', '10+', 474);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Star Wars The Razor Crest', 'The Mandalorian bounty hunter ship with a detailed interior, cargo hold, and carbon-freezing chamber. Includes Mando, Grogu, and more.', 1199, '/images/products/product-15.jpg', 'Star Wars', '10+', 1023);

-- Creator (16-20)
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Creator Street Motorcycle', 'A 3-in-1 Creator set that builds into a street motorcycle, a dragster, or a hoverbike. Great for creative builders who love vehicles.', 179, '/images/products/product-16.jpg', 'Creator', '8+', 236);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Creator Palace Cinema', 'An elegant modular cinema building with detailed interior including a screening room with seats and a concession stand.', 1899, '/images/products/product-17.jpg', 'Creator', '16+', 2196);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Creator Beach Camper Van', 'A 3-in-1 set that transforms between a beach camper van, an ice cream shop, and a surf studio. Includes 2 minifigures.', 349, '/images/products/product-18.jpg', 'Creator', '8+', 556);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Creator Crocodile Locomotive', 'A classic train set with motorized locomotive, passenger car, and circular track. A wonderful display piece for train enthusiasts.', 999, '/images/products/product-19.jpg', 'Creator', '12+', 1271);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Creator Roller Coaster', 'A massive theme park roller coaster with two cars, ticket booth, and cotton candy stand. Features a motorized chain lift.', 2599, '/images/products/product-20.jpg', 'Creator', '12+', 3756);

-- Friends (21-25)
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Friends Heartlake Vet Clinic', 'Help the animals at this fully equipped vet clinic with examination room, X-ray machine, and outdoor play area. Includes 3 characters and 3 animals.', 399, '/images/products/product-21.jpg', 'Friends', '6+', 382);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Friends Heartlake Bookstore', 'A cozy two-story bookstore and cafe with reading nook, book displays, and a balcony terrace. Includes 3 mini-dolls.', 299, '/images/products/product-22.jpg', 'Friends', '6+', 313);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Friends Coffee Shop', 'A charming downtown cafe with pastry display, espresso machine, and outdoor seating area. Includes 2 mini-dolls and accessories.', 199, '/images/products/product-23.jpg', 'Friends', '6+', 210);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Friends Animal Sanctuary', 'A nature rescue center with habitats for injured animals, a lookout tower, and a waterfall. Includes 3 characters and 5 animals.', 699, '/images/products/product-24.jpg', 'Friends', '8+', 631);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Friends Lighthouse Rescue Center', 'A scenic lighthouse on a rocky island with a speedboat, underwater camera, and marine life. Includes 2 mini-dolls and sea creatures.', 549, '/images/products/product-25.jpg', 'Friends', '8+', 468);

-- Architecture (26-30)
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Architecture Colosseum', 'The largest LEGO set ever with a stunning recreation of the Roman Colosseum. Features three stories of detailed arches and columns.', 2999, '/images/products/product-26.jpg', 'Architecture', '18+', 4108);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Architecture Big Ben', 'A detailed microscale model of the Elizabeth Tower (Big Ben) in London. Includes the iconic clock face and Gothic Revival details.', 1799, '/images/products/product-27.jpg', 'Architecture', '16+', 2380);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Architecture Eiffel Tower', 'Build the iconic Eiffel Tower in impressive scale. Features detailed lattice work, observation decks, and authentic Parisian styling.', 2499, '/images/products/product-28.jpg', 'Architecture', '18+', 3212);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Architecture Statue of Liberty', 'A detailed recreation of Lady Liberty with her torch, crown, and tablet. Display stand and nameplate included.', 999, '/images/products/product-29.jpg', 'Architecture', '16+', 1685);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Architecture Taj Mahal', 'An exquisite model of the Taj Mahal with intricate arches, domes, and minarets. A challenging and rewarding build for architecture fans.', 2299, '/images/products/product-30.jpg', 'Architecture', '18+', 3102);

-- Ideas (31-35)
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Ideas NASA Apollo Saturn V', 'A meter-tall model of the Saturn V rocket with detachable stages and a lunar lander. A tribute to the Apollo space missions.', 1199, '/images/products/product-31.jpg', 'Ideas', '16+', 1969);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Ideas Ship in a Bottle', 'A beautifully detailed ship inside a buildable bottle on a display stand. Features a brick-built cork and wax seal.', 499, '/images/products/product-32.jpg', 'Ideas', '12+', 962);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Ideas Titanic', 'A spectacular scale model of the RMS Titanic, split into three sections for easy display. The largest ship model LEGO has produced.', 2699, '/images/products/product-33.jpg', 'Ideas', '18+', 3890);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Ideas Treehouse', 'A beautiful treehouse built around an oak tree with interchangeable leaf canopies for summer and autumn. Includes a cabin, balcony, and swing.', 1499, '/images/products/product-34.jpg', 'Ideas', '16+', 3036);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Ideas World Map', 'A stunning wall art piece showing the world map in a mosaic style. Customizable with three different color schemes for different ocean styles.', 1899, '/images/products/product-35.jpg', 'Ideas', '18+', 2900);

-- Speed Champions (36-40)
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Speed Champions Ferrari F40', 'A detailed replica of the iconic Ferrari F40 supercar with opening rear hatch revealing the engine. Includes a Ferrari driver minifigure.', 199, '/images/products/product-36.jpg', 'Speed Champions', '8+', 271);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Speed Champions Porsche 911 RSR', 'A race-ready Porsche 911 RSR with authentic livery, wide wheel arches, and cockpit details. Includes a racing driver minifigure.', 179, '/images/products/product-37.jpg', 'Speed Champions', '8+', 227);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Speed Champions Lamborghini Countach', 'The legendary Lamborghini Countach in LEGO form with pop-up headlights and scissor doors. A stunning display model for car enthusiasts.', 249, '/images/products/product-38.jpg', 'Speed Champions', '8+', 298);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Speed Champions Bugatti Chiron', 'A sleek Bugatti Chiron with aerodynamic body, detailed cockpit, and spinning rims. Includes a racing driver minifigure.', 199, '/images/products/product-39.jpg', 'Speed Champions', '8+', 282);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Speed Champions F1 Race Car', 'A fast and sleek Formula 1 race car with authentic details, adjustable rear wing, and team colors. Includes a driver minifigure.', 149, '/images/products/product-40.jpg', 'Speed Champions', '8+', 156);

-- Marvel (41-45)
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Marvel Avengers Tower', 'The iconic Avengers Tower with five detailed levels, a Quinjet, and 8 superhero minifigures. Perfect for recreating epic battle scenes.', 1499, '/images/products/product-41.jpg', 'Marvel', '12+', 1721);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Marvel Black Panther Royal Palace', 'Wakanda Forever! Build the royal palace of Wakanda with throne room, lab, and waterfall. Includes Black Panther and 5 other minifigures.', 899, '/images/products/product-42.jpg', 'Marvel', '10+', 832);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Marvel Hulkbuster Armor', 'Tony Stark massive Hulkbuster suit with articulated joints and opening cockpit. A towering display model standing over 30 cm tall.', 549, '/images/products/product-43.jpg', 'Marvel', '12+', 456);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Marvel Captain America Shield', 'Build and display Captain America iconic vibranium shield. A detailed wall art piece with an authentic red, white, and blue design.', 399, '/images/products/product-44.jpg', 'Marvel', '18+', 687);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Marvel Spider-Man Bridge Battle', 'An epic bridge battle scene with Spider-Man, Green Goblin, and Doc Ock. Features a collapsible bridge section and web-slinging action.', 699, '/images/products/product-45.jpg', 'Marvel', '8+', 584);

-- Ninjago (46-50)
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Ninjago City Gardens', 'A massive three-level Ninjago City building with shops, a museum, and a rooftop garden. Includes 19 minifigures for epic storytelling.', 2499, '/images/products/product-46.jpg', 'Ninjago', '16+', 3654);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Ninjago Fire Fang Dragon', 'A fearsome dragon with posable wings, snapping jaws, and flaming tail. Includes 4 ninja minifigures with weapons.', 349, '/images/products/product-47.jpg', 'Ninjago', '8+', 463);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Ninjago City Docks', 'A detailed dockside location with fishmonger, comic book shop, and hidden ninja training area. Includes 13 minifigures.', 1799, '/images/products/product-48.jpg', 'Ninjago', '12+', 2780);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Ninjago Temple of Airjitzu', 'A serene mountain temple with multiple rooms, a waterfall, and a cherry blossom tree. Includes 12 minifigures and detailed interiors.', 1599, '/images/products/product-49.jpg', 'Ninjago', '12+', 2028);
INSERT INTO products (name, description, price, image_url, category, age_range, piece_count) VALUES
('LEGO Ninjago Ice Samurai Mech', 'A towering ice-themed mech with articulated limbs, ice sword, and freeze cannon. Includes 3 minifigures for battle play.', 299, '/images/products/product-50.jpg', 'Ninjago', '8+', 312);
