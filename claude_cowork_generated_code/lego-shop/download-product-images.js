#!/usr/bin/env node
/**
 * LEGO Shop – Product Image Downloader
 * ─────────────────────────────────────
 * Run this script once from your computer to download real LEGO product
 * box images from brickset.com.
 *
 *   node download-product-images.js
 *
 * Images are saved to:
 *   server/public/images/products/product-{id}.jpg
 *
 * The app's seed.sql already references .jpg paths, so images will
 * appear automatically after the server restarts.
 *
 * Requirements: Node 18+ (uses built-in fetch)
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR   = path.join(__dirname, 'server', 'public', 'images', 'products');

fs.mkdirSync(OUT_DIR, { recursive: true });

// ── Real LEGO set numbers mapped to our 50 products ──────────────────────────
const PRODUCTS = [
  { id: 1,  setNum: '60316', name: 'City Police Station'         },
  { id: 2,  setNum: '60261', name: 'City Airport Terminal'       },
  { id: 3,  setNum: '60320', name: 'City Fire Station'           },
  { id: 4,  setNum: '60330', name: 'City Hospital'               },
  { id: 5,  setNum: '60306', name: 'City Shopping Mall'          },
  { id: 6,  setNum: '42143', name: 'Technic Lamborghini Revuelto'},
  { id: 7,  setNum: '42131', name: 'Technic CAT Excavator'       },
  { id: 8,  setNum: '42146', name: 'Technic Liebherr Crane'      },
  { id: 9,  setNum: '42110', name: 'Technic Land Rover Defender' },
  { id: 10, setNum: '42107', name: 'Technic Ducati Panigale'     },
  { id: 11, setNum: '75257', name: 'Star Wars Millennium Falcon' },
  { id: 12, setNum: '75313', name: 'Star Wars AT-AT Walker'      },
  { id: 13, setNum: '75243', name: 'Star Wars Slave I'           },
  { id: 14, setNum: '75301', name: 'Star Wars X-Wing'            },
  { id: 15, setNum: '75331', name: 'Star Wars Razor Crest'       },
  { id: 16, setNum: '31114', name: 'Creator Street Motorcycle'   },
  { id: 17, setNum: '10232', name: 'Creator Palace Cinema'       },
  { id: 18, setNum: '31138', name: 'Creator Beach Camper Van'    },
  { id: 19, setNum: '10277', name: 'Creator Locomotive'          },
  { id: 20, setNum: '10261', name: 'Creator Roller Coaster'      },
  { id: 21, setNum: '41695', name: 'Friends Vet Clinic'          },
  { id: 22, setNum: '41711', name: 'Friends Bookstore'           },
  { id: 23, setNum: '41426', name: 'Friends Coffee Shop'         },
  { id: 24, setNum: '41761', name: 'Friends Animal Sanctuary'    },
  { id: 25, setNum: '41380', name: 'Friends Lighthouse'          },
  { id: 26, setNum: '10276', name: 'Architecture Colosseum'      },
  { id: 27, setNum: '21013', name: 'Architecture Big Ben'        },
  { id: 28, setNum: '10307', name: 'Architecture Eiffel Tower'   },
  { id: 29, setNum: '21042', name: 'Architecture Statue of Liberty'},
  { id: 30, setNum: '21056', name: 'Architecture Taj Mahal'      },
  { id: 31, setNum: '92176', name: 'Ideas NASA Saturn V'         },
  { id: 32, setNum: '92177', name: 'Ideas Ship in a Bottle'      },
  { id: 33, setNum: '10294', name: 'Ideas Titanic'               },
  { id: 34, setNum: '21318', name: 'Ideas Treehouse'             },
  { id: 35, setNum: '31203', name: 'Ideas World Map'             },
  { id: 36, setNum: '76895', name: 'Speed Champions Ferrari F40' },
  { id: 37, setNum: '76916', name: 'Speed Champions Porsche 911' },
  { id: 38, setNum: '76908', name: 'Speed Champions Lamborghini Countach'},
  { id: 39, setNum: '76888', name: 'Speed Champions Bugatti Chiron'},
  { id: 40, setNum: '76900', name: 'Speed Champions F1 Car'      },
  { id: 41, setNum: '76269', name: 'Marvel Avengers Tower'       },
  { id: 42, setNum: '76218', name: 'Marvel Black Panther'        },
  { id: 43, setNum: '76210', name: 'Marvel Hulkbuster'           },
  { id: 44, setNum: '76262', name: 'Marvel Captain America Shield'},
  { id: 45, setNum: '76279', name: 'Marvel Spider-Man Bridge'    },
  { id: 46, setNum: '71741', name: 'Ninjago City Gardens'        },
  { id: 47, setNum: '71753', name: 'Ninjago Fire Dragon'         },
  { id: 48, setNum: '70657', name: 'Ninjago City Docks'          },
  { id: 49, setNum: '70751', name: 'Ninjago Temple of Airjitzu'  },
  { id: 50, setNum: '71756', name: 'Ninjago Ice Mech'            },
];

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
};

function candidateUrls(setNum) {
  return [
    // Brickset – highest quality box images
    `https://images.brickset.com/sets/images/${setNum}-1.jpg`,
    // BrickLink
    `https://img.bricklink.com/ItemImage/SN/0/${setNum}-1.png`,
    `https://img.bricklink.com/ItemImage/SL/${setNum}.jpg`,
    // Rebrickable
    `https://cdn.rebrickable.com/media/sets/${setNum}-1/${setNum}-1.jpg`,
  ];
}

async function tryDownload(url, destPath) {
  try {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 5000) return false;          // too small → probably an error page
    // Check for image magic bytes
    const magic = buf.slice(0, 4);
    const isJpeg = magic[0] === 0xFF && magic[1] === 0xD8;
    const isPng  = magic.toString('ascii', 0, 4) === '\x89PNG';
    const isWebP = magic.toString('ascii', 0, 4) === 'RIFF';
    if (!isJpeg && !isPng && !isWebP) return false;
    fs.writeFileSync(destPath, buf);
    return true;
  } catch {
    return false;
  }
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  let ok = 0, skipped = 0;
  console.log(`Downloading images to: ${OUT_DIR}\n`);

  for (const { id, setNum, name } of PRODUCTS) {
    const destJpg = path.join(OUT_DIR, `product-${id}.jpg`);

    // Skip if already downloaded
    if (fs.existsSync(destJpg) && fs.statSync(destJpg).size > 5000) {
      console.log(`  [${String(id).padStart(2,'0')}] ✓ already exists — skip`);
      ok++;
      continue;
    }

    let downloaded = false;
    for (const url of candidateUrls(setNum)) {
      if (await tryDownload(url, destJpg)) {
        console.log(`  [${String(id).padStart(2,'0')}] ✓ ${name}`);
        downloaded = true;
        ok++;
        break;
      }
      await sleep(50);
    }

    if (!downloaded) {
      console.log(`  [${String(id).padStart(2,'0')}] ✗ ${name} (${setNum}) — SVG fallback kept`);
      skipped++;
    }

    await sleep(150);   // be polite to the servers
  }

  console.log(`\n✓ Done: ${ok} downloaded, ${skipped} kept as SVG`);
  if (skipped > 0) {
    console.log(`  SVG fallbacks are still served for missing images.`);
  }
  console.log(`\nRestart the backend server to serve the new images.`);
}

main().catch(console.error);
