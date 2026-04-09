#!/usr/bin/env python3
"""
Generate 50 SVG product images for a Lego shop website
"""

import os

# Define product categories with background colors
PRODUCTS = {
    # City (1-5) - Blue
    "city": {
        "bg_color": "#1E88E5",
        "accent_color": "#FFA500",
        "products": [
            {"id": 1, "name": "Police Station"},
            {"id": 2, "name": "Airport"},
            {"id": 3, "name": "Fire Station"},
            {"id": 4, "name": "Hospital"},
            {"id": 5, "name": "Shopping Mall"},
        ]
    },
    # Technic (6-10) - Orange
    "technic": {
        "bg_color": "#FF6F00",
        "accent_color": "#FFB74D",
        "products": [
            {"id": 6, "name": "Lamborghini"},
            {"id": 7, "name": "Excavator"},
            {"id": 8, "name": "Liebherr"},
            {"id": 9, "name": "Land Rover"},
            {"id": 10, "name": "Ducati"},
        ]
    },
    # Star Wars (11-15) - Dark Gray
    "star_wars": {
        "bg_color": "#424242",
        "accent_color": "#FFD700",
        "products": [
            {"id": 11, "name": "Millennium Falcon"},
            {"id": 12, "name": "AT-AT"},
            {"id": 13, "name": "Slave I"},
            {"id": 14, "name": "X-Wing"},
            {"id": 15, "name": "Razorcrest"},
        ]
    },
    # Creator (16-20) - Green
    "creator": {
        "bg_color": "#43A047",
        "accent_color": "#A5D6A7",
        "products": [
            {"id": 16, "name": "Street Bike"},
            {"id": 17, "name": "Cinema"},
            {"id": 18, "name": "Beach Camper"},
            {"id": 19, "name": "Train"},
            {"id": 20, "name": "Roller Coaster"},
        ]
    },
    # Friends (21-25) - Purple
    "friends": {
        "bg_color": "#7B1FA2",
        "accent_color": "#E1BEE7",
        "products": [
            {"id": 21, "name": "Vet Clinic"},
            {"id": 22, "name": "Bookstore"},
            {"id": 23, "name": "Coffee Shop"},
            {"id": 24, "name": "Animal Sanctuary"},
            {"id": 25, "name": "Lighthouse"},
        ]
    },
    # Architecture (26-30) - Tan
    "architecture": {
        "bg_color": "#D7CCC8",
        "accent_color": "#8D6E63",
        "products": [
            {"id": 26, "name": "Colosseum"},
            {"id": 27, "name": "Big Ben"},
            {"id": 28, "name": "Eiffel Tower"},
            {"id": 29, "name": "Statue of Liberty"},
            {"id": 30, "name": "Taj Mahal"},
        ]
    },
    # Ideas (31-35) - Teal
    "ideas": {
        "bg_color": "#00897B",
        "accent_color": "#80DEEA",
        "products": [
            {"id": 31, "name": "Saturn V"},
            {"id": 32, "name": "Ship in Bottle"},
            {"id": 33, "name": "Titanic"},
            {"id": 34, "name": "Treehouse"},
            {"id": 35, "name": "World Map"},
        ]
    },
    # Speed Champions (36-40) - Red
    "speed_champions": {
        "bg_color": "#C62828",
        "accent_color": "#E53935",
        "products": [
            {"id": 36, "name": "Ferrari F40"},
            {"id": 37, "name": "Porsche 911"},
            {"id": 38, "name": "Lamborghini Countach"},
            {"id": 39, "name": "Bugatti Chiron"},
            {"id": 40, "name": "F1 Car"},
        ]
    },
    # Marvel (41-45) - Dark Red
    "marvel": {
        "bg_color": "#B71C1C",
        "accent_color": "#FDD835",
        "products": [
            {"id": 41, "name": "Avengers Tower"},
            {"id": 42, "name": "Black Panther Palace"},
            {"id": 43, "name": "Hulkbuster"},
            {"id": 44, "name": "Cap Shield"},
            {"id": 45, "name": "Spider-Man Bridge"},
        ]
    },
    # Ninjago (46-50) - Dark Green
    "ninjago": {
        "bg_color": "#1B5E20",
        "accent_color": "#FFC107",
        "products": [
            {"id": 46, "name": "City Gardens"},
            {"id": 47, "name": "Fire Dragon"},
            {"id": 48, "name": "City Docks"},
            {"id": 49, "name": "Temple of Air"},
            {"id": 50, "name": "Ice Samurai"},
        ]
    }
}

def create_lego_dots(start_x, start_y, spacing=15, count=4):
    """Create a pattern of Lego brick dots"""
    dots = []
    for i in range(count):
        for j in range(count):
            x = start_x + i * spacing
            y = start_y + j * spacing
            dots.append(f'<circle cx="{x}" cy="{y}" r="2.5" fill="rgba(255,255,255,0.3)"/>')
    return '\n'.join(dots)

def create_city_building(cx, cy, width, height, color):
    """Create a simple building shape"""
    return f'''
    <rect x="{cx - width/2}" y="{cy - height/2}" width="{width}" height="{height}" fill="{color}" stroke="white" stroke-width="2"/>
    <rect x="{cx - width/2 + 5}" y="{cy - height/2 + 5}" width="{width - 10}" height="{height - 10}" fill="{color}"/>
    <!-- Windows -->
    <rect x="{cx - 40}" y="{cy - 50}" width="15" height="15" fill="#87CEEB"/>
    <rect x="{cx - 10}" y="{cy - 50}" width="15" height="15" fill="#87CEEB"/>
    <rect x="{cx + 20}" y="{cy - 50}" width="15" height="15" fill="#87CEEB"/>
    <rect x="{cx - 40}" y="{cy - 20}" width="15" height="15" fill="#87CEEB"/>
    <rect x="{cx - 10}" y="{cy - 20}" width="15" height="15" fill="#87CEEB"/>
    <rect x="{cx + 20}" y="{cy - 20}" width="15" height="15" fill="#87CEEB"/>
    '''

def create_vehicle(cx, cy, color):
    """Create a simple vehicle shape"""
    return f'''
    <ellipse cx="{cx}" cy="{cy}" rx="50" ry="25" fill="{color}" stroke="white" stroke-width="2"/>
    <circle cx="{cx - 30}" cy="{cy + 20}" r="10" fill="#333"/>
    <circle cx="{cx + 30}" cy="{cy + 20}" r="10" fill="#333"/>
    <rect x="{cx - 35}" y="{cy - 15}" width="30" height="15" fill="#87CEEB"/>
    '''

def create_ship(cx, cy, color):
    """Create a simple ship shape"""
    return f'''
    <polygon points="{cx - 50},{cy + 30} {cx + 50},{cy + 30} {cx + 40},{cy - 20} {cx - 40},{cy - 20}" fill="{color}" stroke="white" stroke-width="2"/>
    <polygon points="{cx - 10},{cy - 20} {cx + 10},{cy - 20} {cx + 5},{cy - 40} {cx - 5},{cy - 40}" fill="#DAA520"/>
    '''

def create_building_tower(cx, cy, color):
    """Create a tall tower/building shape"""
    return f'''
    <polygon points="{cx},{cy - 60} {cx + 40},{cy} {cx - 40},{cy}" fill="{color}" stroke="white" stroke-width="2"/>
    <polygon points="{cx},{cy - 60} {cx - 40},{cy} {cx - 50},{cy + 10}" fill="rgba(0,0,0,0.1)"/>
    <rect x="{cx - 15}" y="{cy - 40}" width="10" height="10" fill="#FFD700"/>
    <rect x="{cx + 5}" y="{cy - 40}" width="10" height="10" fill="#FFD700"/>
    <rect x="{cx - 15}" y="{cy - 25}" width="10" height="10" fill="#FFD700"/>
    <rect x="{cx + 5}" y="{cy - 25}" width="10" height="10" fill="#FFD700"/>
    '''

def create_dragon(cx, cy, color):
    """Create a simple dragon shape"""
    return f'''
    <!-- Body -->
    <ellipse cx="{cx}" cy="{cy}" rx="45" ry="30" fill="{color}" stroke="white" stroke-width="2"/>
    <!-- Head -->
    <circle cx="{cx + 50}" cy="{cy - 10}" r="20" fill="{color}" stroke="white" stroke-width="2"/>
    <!-- Tail -->
    <path d="M {cx - 50} {cy} Q {cx - 80} {cy - 30} {cx - 70} {cy - 50}" fill="none" stroke="{color}" stroke-width="20"/>
    <!-- Wings -->
    <polygon points="{cx},{cy - 25} {cx - 40},{cy - 50} {cx - 20},{cy - 40}" fill="#FF6B00" opacity="0.8"/>
    <polygon points="{cx},{cy + 25} {cx + 40},{cy + 50} {cx + 20},{cy + 40}" fill="#FF6B00" opacity="0.8"/>
    '''

def create_robot(cx, cy, color):
    """Create a simple robot shape"""
    return f'''
    <!-- Body -->
    <rect x="{cx - 25}" y="{cy - 30}" width="50" height="50" fill="{color}" stroke="white" stroke-width="2" rx="3"/>
    <!-- Head -->
    <rect x="{cx - 20}" y="{cy - 50}" width="40" height="30" fill="{color}" stroke="white" stroke-width="2" rx="2"/>
    <!-- Eyes -->
    <rect x="{cx - 15}" y="{cy - 42}" width="8" height="8" fill="#FFD700"/>
    <rect x="{cx + 7}" y="{cy - 42}" width="8" height="8" fill="#FFD700"/>
    <!-- Arms -->
    <rect x="{cx - 50}" y="{cy - 20}" width="25" height="15" fill="{color}" stroke="white" stroke-width="2" rx="2"/>
    <rect x="{cx + 25}" y="{cy - 20}" width="25" height="15" fill="{color}" stroke="white" stroke-width="2" rx="2"/>
    '''

def create_flower(cx, cy, color):
    """Create a simple flower shape"""
    return f'''
    <!-- Petals -->
    <circle cx="{cx}" cy="{cy - 25}" r="15" fill="{color}" stroke="white" stroke-width="1.5"/>
    <circle cx="{cx + 25}" cy="{cy - 15}" r="15" fill="{color}" stroke="white" stroke-width="1.5"/>
    <circle cx="{cx + 25}" cy="{cy + 15}" r="15" fill="{color}" stroke="white" stroke-width="1.5"/>
    <circle cx="{cx}" cy="{cy + 25}" r="15" fill="{color}" stroke="white" stroke-width="1.5"/>
    <circle cx="{cx - 25}" cy="{cy + 15}" r="15" fill="{color}" stroke="white" stroke-width="1.5"/>
    <circle cx="{cx - 25}" cy="{cy - 15}" r="15" fill="{color}" stroke="white" stroke-width="1.5"/>
    <!-- Center -->
    <circle cx="{cx}" cy="{cy}" r="12" fill="#FFD700" stroke="white" stroke-width="1.5"/>
    <!-- Stem -->
    <line x1="{cx}" y1="{cy + 25}" x2="{cx - 10}" y2="{cy + 50}" stroke="#228B22" stroke-width="3"/>
    '''

def create_svg(product_id, product_name, category_info):
    """Generate SVG content for a product"""
    bg_color = category_info["bg_color"]
    accent_color = category_info["accent_color"]

    # SVG header
    svg = f'''<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
    <defs>
        <style>
            .product-title {{ font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; fill: white; text-anchor: middle; }}
        </style>
    </defs>
    <!-- Background -->
    <rect width="400" height="300" fill="{bg_color}"/>
    '''

    # Create different shapes based on product ID
    if product_id <= 5:  # City - buildings
        svg += create_city_building(200, 140, 80, 100, accent_color)
    elif product_id <= 10:  # Technic - vehicles
        svg += create_vehicle(200, 140, accent_color)
    elif product_id <= 15:  # Star Wars - ships
        svg += create_ship(200, 140, accent_color)
    elif product_id <= 20:  # Creator - various
        if product_id % 2 == 0:
            svg += create_vehicle(200, 140, accent_color)
        else:
            svg += create_building_tower(200, 140, accent_color)
    elif product_id <= 25:  # Friends - buildings with flowers
        svg += create_building_tower(200, 100, accent_color)
        svg += create_flower(200, 200, "#FF69B4")
    elif product_id <= 30:  # Architecture - tall buildings
        svg += create_building_tower(200, 140, accent_color)
    elif product_id <= 35:  # Ideas - space/ship themes
        if product_id <= 33:
            svg += create_ship(200, 140, accent_color)
        else:
            svg += create_building_tower(200, 140, accent_color)
    elif product_id <= 40:  # Speed Champions - fast cars
        svg += create_vehicle(200, 140, accent_color)
    elif product_id <= 45:  # Marvel - robots/structures
        svg += create_robot(200, 140, accent_color)
    elif product_id <= 50:  # Ninjago - dragons/warriors
        svg += create_dragon(200, 140, accent_color)

    # Lego dots pattern
    svg += f'''
    <!-- Lego brick dots -->
    {create_lego_dots(50, 40, spacing=18, count=3)}

    <!-- Product title -->
    <text x="200" y="280" class="product-title">{product_name}</text>
    </svg>'''

    return svg

def main():
    output_dir = "/sessions/focused-nice-carson/mnt/Claude Workshop 2/lego-shop/server/public/images/products/"

    # Ensure directory exists
    os.makedirs(output_dir, exist_ok=True)

    product_num = 1

    for category, category_data in PRODUCTS.items():
        for product in category_data["products"]:
            product_id = product["id"]
            product_name = product["name"]

            # Generate SVG
            svg_content = create_svg(product_id, product_name, category_data)

            # Write to file
            filename = f"product-{product_id}.svg"
            filepath = os.path.join(output_dir, filename)

            with open(filepath, 'w') as f:
                f.write(svg_content)

            print(f"Created {filename} - {category.upper()}: {product_name}")

    print(f"\nSuccessfully created 50 product SVG images in {output_dir}")

if __name__ == "__main__":
    main()
