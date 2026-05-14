import { createClient } from "@supabase/supabase-js";

type SpeciesSeed = {
  species_name: string;
  hindi_name: string;
  care_requirements_json: {
    water: string;
    sunlight: string;
    soil: string;
    fertilizer: string;
    humidity: string;
    temperature: string;
    notes: string[];
  };
};

const species: SpeciesSeed[] = [
  { species_name: "Tulsi / Holy Basil", hindi_name: "तुलसी", care_requirements_json: { water: "Keep evenly moist; water when top 2 cm dries.", sunlight: "4-6 hours morning sun.", soil: "Well-draining loam with compost.", fertilizer: "Light organic feed every 20-30 days.", humidity: "Moderate.", temperature: "18-35C.", notes: ["Pinch flowers for bushier growth", "Avoid cold drafts"] } },
  { species_name: "Money Plant / Pothos", hindi_name: "मनी प्लांट", care_requirements_json: { water: "Water when top half of soil dries.", sunlight: "Bright indirect light; tolerates shade.", soil: "Airy potting mix.", fertilizer: "Monthly diluted balanced feed.", humidity: "Moderate to high.", temperature: "18-32C.", notes: ["Avoid soggy roots", "Trim vines to encourage branching"] } },
  { species_name: "Rose", hindi_name: "गुलाब", care_requirements_json: { water: "Deep water 2-3 times weekly in heat.", sunlight: "6+ hours direct sun.", soil: "Rich loam with drainage.", fertilizer: "Rose feed every 3-4 weeks in growing season.", humidity: "Low to moderate.", temperature: "15-32C.", notes: ["Deadhead spent blooms", "Prune for airflow"] } },
  { species_name: "Mango", hindi_name: "आम", care_requirements_json: { water: "Deep but infrequent watering after establishment.", sunlight: "Full sun.", soil: "Deep well-drained soil.", fertilizer: "Compost and balanced fruit tree feed seasonally.", humidity: "Moderate.", temperature: "24-38C.", notes: ["Protect flowers from fungal disease", "Avoid waterlogging"] } },
  { species_name: "Neem", hindi_name: "नीम", care_requirements_json: { water: "Low water once established.", sunlight: "Full sun.", soil: "Tolerates poor soil with drainage.", fertilizer: "Minimal; compost once or twice a year.", humidity: "Low to moderate.", temperature: "20-40C.", notes: ["Excellent heat tolerance", "Prune lightly for shape"] } },
  { species_name: "Aloe Vera", hindi_name: "घृतकुमारी", care_requirements_json: { water: "Water deeply only after soil dries fully.", sunlight: "Bright light with gentle sun.", soil: "Gritty cactus mix.", fertilizer: "Very light feed twice yearly.", humidity: "Low.", temperature: "16-34C.", notes: ["Overwatering is the biggest risk", "Use wide drainage holes"] } },
  { species_name: "Snake Plant", hindi_name: "स्नेक प्लांट", care_requirements_json: { water: "Every 2-4 weeks depending on light.", sunlight: "Low to bright indirect light.", soil: "Fast-draining mix.", fertilizer: "Diluted feed in spring and monsoon.", humidity: "Low to moderate.", temperature: "16-32C.", notes: ["Let soil dry completely", "Avoid water in rosette"] } },
  { species_name: "Peace Lily", hindi_name: "पीस लिली", care_requirements_json: { water: "Keep lightly moist; wilts when thirsty.", sunlight: "Bright indirect light.", soil: "Moisture-retentive but draining mix.", fertilizer: "Diluted feed every 6 weeks.", humidity: "High.", temperature: "18-30C.", notes: ["Use filtered water when tips brown", "Avoid direct afternoon sun"] } },
  { species_name: "Hibiscus", hindi_name: "गुड़हल", care_requirements_json: { water: "Regular water during flowering.", sunlight: "5-6 hours sun.", soil: "Rich, slightly acidic loam.", fertilizer: "High potassium feed for blooms.", humidity: "Moderate.", temperature: "18-35C.", notes: ["Watch for mealybugs", "Prune after flowering flush"] } },
  { species_name: "Jasmine / Mogra", hindi_name: "मोगरा", care_requirements_json: { water: "Moist but not soggy.", sunlight: "4-6 hours sun.", soil: "Fertile well-drained soil.", fertilizer: "Compost and bloom feed monthly.", humidity: "Moderate.", temperature: "18-34C.", notes: ["Prune after flowering", "Needs bright light for fragrance"] } },
  { species_name: "Curry Leaf", hindi_name: "कड़ी पत्ता", care_requirements_json: { water: "Water when top soil dries.", sunlight: "Full to partial sun.", soil: "Well-drained fertile soil.", fertilizer: "Nitrogen-rich organic feed monthly.", humidity: "Moderate.", temperature: "20-35C.", notes: ["Protect from cold", "Harvest lightly from mature branches"] } },
  { species_name: "Mint", hindi_name: "पुदीना", care_requirements_json: { water: "Keep consistently moist.", sunlight: "Morning sun or bright shade.", soil: "Rich moist soil.", fertilizer: "Light compost feed every month.", humidity: "Moderate.", temperature: "16-32C.", notes: ["Cut back often", "Best grown in separate pot"] } },
  { species_name: "Coriander", hindi_name: "धनिया", care_requirements_json: { water: "Light frequent watering.", sunlight: "Morning sun in hot climates.", soil: "Loose fertile soil.", fertilizer: "Compost before sowing.", humidity: "Moderate.", temperature: "15-28C.", notes: ["Bolts in heat", "Succession sow every 2 weeks"] } },
  { species_name: "Tomato", hindi_name: "टमाटर", care_requirements_json: { water: "Deep consistent watering.", sunlight: "6-8 hours sun.", soil: "Rich draining soil.", fertilizer: "Tomato feed after flowering.", humidity: "Moderate.", temperature: "18-32C.", notes: ["Stake early", "Mulch to reduce soil splash"] } },
  { species_name: "Chilli", hindi_name: "मिर्च", care_requirements_json: { water: "Water when top 3 cm dries.", sunlight: "5-7 hours sun.", soil: "Well-drained fertile mix.", fertilizer: "Balanced feed, reduce nitrogen after flowering.", humidity: "Moderate.", temperature: "20-35C.", notes: ["Watch whiteflies", "Avoid overwatering"] } },
  { species_name: "Brinjal / Eggplant", hindi_name: "बैंगन", care_requirements_json: { water: "Regular deep watering.", sunlight: "Full sun.", soil: "Rich loam.", fertilizer: "Compost plus balanced feed.", humidity: "Moderate.", temperature: "22-35C.", notes: ["Monitor for aphids and mites", "Support heavy fruiting branches"] } },
  { species_name: "Marigold", hindi_name: "गेंदा", care_requirements_json: { water: "Moderate; let surface dry.", sunlight: "Full sun.", soil: "Average well-drained soil.", fertilizer: "Low nitrogen feed occasionally.", humidity: "Low to moderate.", temperature: "18-34C.", notes: ["Deadhead for more blooms", "Good companion plant"] } },
  { species_name: "Bougainvillea", hindi_name: "बोगनवेलिया", care_requirements_json: { water: "Sparse watering after establishment.", sunlight: "Full strong sun.", soil: "Lean well-drained soil.", fertilizer: "Low nitrogen bloom feed.", humidity: "Low.", temperature: "20-38C.", notes: ["Flowers better when slightly root-bound", "Avoid overfeeding"] } },
  { species_name: "Areca Palm", hindi_name: "अरेका पाम", care_requirements_json: { water: "Keep lightly moist.", sunlight: "Bright indirect light.", soil: "Rich airy mix.", fertilizer: "Palm feed every 6-8 weeks.", humidity: "High.", temperature: "18-32C.", notes: ["Brown tips mean dry air or salts", "Rotate for even growth"] } },
  { species_name: "Rubber Plant", hindi_name: "रबर प्लांट", care_requirements_json: { water: "Water when top third dries.", sunlight: "Bright indirect light.", soil: "Chunky well-draining mix.", fertilizer: "Monthly in growing season.", humidity: "Moderate.", temperature: "18-32C.", notes: ["Wipe leaves", "Avoid sudden dark corners"] } },
  { species_name: "Monstera", hindi_name: "मॉन्स्टेरा", care_requirements_json: { water: "Water when top 4 cm dries.", sunlight: "Bright indirect light.", soil: "Aroid mix with bark.", fertilizer: "Balanced feed monthly.", humidity: "High.", temperature: "18-32C.", notes: ["Use moss pole", "Fenestrations improve with light"] } },
  { species_name: "Banana", hindi_name: "केला", care_requirements_json: { water: "Heavy regular watering with drainage.", sunlight: "Full sun.", soil: "Rich moisture-retentive soil.", fertilizer: "High potassium feed.", humidity: "High.", temperature: "22-36C.", notes: ["Protect from strong wind", "Remove dead leaves"] } },
  { species_name: "Papaya", hindi_name: "पपीता", care_requirements_json: { water: "Moderate regular water.", sunlight: "Full sun.", soil: "Deep draining soil.", fertilizer: "Balanced fruit feed monthly.", humidity: "Moderate.", temperature: "22-35C.", notes: ["Avoid root disturbance", "Needs drainage"] } },
  { species_name: "Lemon", hindi_name: "नींबू", care_requirements_json: { water: "Deep water when top soil dries.", sunlight: "6+ hours sun.", soil: "Well-drained slightly acidic soil.", fertilizer: "Citrus feed during growth.", humidity: "Moderate.", temperature: "18-35C.", notes: ["Watch leaf miner and scale", "Do not let pot sit in water"] } },
  { species_name: "Guava", hindi_name: "अमरूद", care_requirements_json: { water: "Moderate deep water.", sunlight: "Full sun.", soil: "Adaptable, well-drained soil.", fertilizer: "Compost and fruit tree feed.", humidity: "Moderate.", temperature: "20-36C.", notes: ["Prune for manageable shape", "Bag fruits if fruit fly pressure is high"] } },
  { species_name: "Pomegranate", hindi_name: "अनार", care_requirements_json: { water: "Low to moderate; avoid waterlogging.", sunlight: "Full sun.", soil: "Well-drained loam.", fertilizer: "Compost plus potassium during fruiting.", humidity: "Low to moderate.", temperature: "20-38C.", notes: ["Needs sun for fruit color", "Prune suckers"] } },
  { species_name: "Champa / Plumeria", hindi_name: "चंपा", care_requirements_json: { water: "Moderate in summer, low in dormancy.", sunlight: "Full sun.", soil: "Fast-draining sandy mix.", fertilizer: "Bloom feed in warm months.", humidity: "Moderate.", temperature: "20-36C.", notes: ["Avoid wet cold soil", "Cuttings root easily"] } },
  { species_name: "Orchid", hindi_name: "ऑर्किड", care_requirements_json: { water: "Water bark when nearly dry.", sunlight: "Bright filtered light.", soil: "Orchid bark, not garden soil.", fertilizer: "Weak orchid feed weekly in growth.", humidity: "High.", temperature: "18-30C.", notes: ["Air roots are normal", "Avoid standing water in crown"] } },
  { species_name: "Lucky Bamboo", hindi_name: "लकी बैम्बू", care_requirements_json: { water: "Change water weekly or keep soil moist.", sunlight: "Low to bright indirect light.", soil: "Water or loose soil.", fertilizer: "Tiny diluted feed every 2 months.", humidity: "Moderate.", temperature: "18-32C.", notes: ["Use filtered water", "Yellow stalks rarely recover"] } },
  { species_name: "Aparajita / Butterfly Pea", hindi_name: "अपराजिता", care_requirements_json: { water: "Moderate regular water.", sunlight: "Full to partial sun.", soil: "Well-drained soil.", fertilizer: "Light compost; legumes need little nitrogen.", humidity: "Moderate.", temperature: "20-35C.", notes: ["Provide trellis", "Harvest flowers regularly"] } },
  { species_name: "Brahmi", hindi_name: "ब्राह्मी", care_requirements_json: { water: "Keep very moist.", sunlight: "Morning sun or bright shade.", soil: "Moist rich soil.", fertilizer: "Light compost tea.", humidity: "High.", temperature: "18-32C.", notes: ["Can grow in shallow water", "Trim for dense mat"] } }
];

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

async function embed(text: string): Promise<number[]> {
  const response = await fetch("https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-mpnet-base-v2", {
    method: "POST",
    headers: { Authorization: `Bearer ${env("HUGGINGFACE_API_KEY")}`, "Content-Type": "application/json" },
    body: JSON.stringify({ inputs: text, options: { wait_for_model: true } })
  });
  if (!response.ok) throw new Error(`Embedding failed: ${response.status} ${await response.text()}`);
  const raw = await response.json();
  const vector = Array.isArray(raw[0]) && typeof raw[0][0] === "number" ? raw[0] : raw[0]?.[0];
  if (!Array.isArray(vector)) throw new Error("Unexpected embedding response");
  return vector.slice(0, 768);
}

async function main() {
  const supabase = createClient(env("NEXT_PUBLIC_SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"));
  for (const item of species) {
    const care = item.care_requirements_json;
    const text = `${item.species_name} ${item.hindi_name}. Water: ${care.water}. Sunlight: ${care.sunlight}. Soil: ${care.soil}. Notes: ${care.notes.join(", ")}`;
    const embedding = await embed(text);
    const { error } = await supabase.from("species_care").upsert({ ...item, embedding }, { onConflict: "species_name" });
    if (error) throw error;
    console.log(`Seeded species care: ${item.species_name}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
