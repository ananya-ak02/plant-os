import { createClient } from "@supabase/supabase-js";

type DiseaseSeed = {
  name: string;
  description: string;
  symptoms: string[];
  treatment: string;
  severity: "low" | "medium" | "high";
};

const diseases: DiseaseSeed[] = [
  { name: "Powdery mildew", description: "White powdery fungal growth on leaves during warm days and humid nights.", symptoms: ["white leaf coating", "curled leaves", "slow growth"], treatment: "Improve airflow, remove infected leaves, spray neem oil or potassium bicarbonate in the evening.", severity: "medium" },
  { name: "Downy mildew", description: "Grey or purple fuzzy growth under leaves with yellow patches above.", symptoms: ["yellow patches", "grey underside growth", "leaf drop"], treatment: "Water at soil level, reduce humidity, remove affected foliage, apply copper-based fungicide when needed.", severity: "medium" },
  { name: "Leaf blight", description: "Rapid browning and drying of leaf sections, common during monsoon humidity.", symptoms: ["brown leaf patches", "yellow halo", "drying tips"], treatment: "Prune infected leaves, avoid overhead watering, apply copper oxychloride or biofungicide.", severity: "high" },
  { name: "Alternaria leaf spot", description: "Concentric dark target-like spots on leaves of tomato, chilli, brinjal, and ornamentals.", symptoms: ["target spots", "yellowing", "premature leaf fall"], treatment: "Remove diseased leaves, mulch soil, rotate crops, spray neem or copper fungicide.", severity: "medium" },
  { name: "Cercospora leaf spot", description: "Small circular grey-brown spots with reddish margins on leafy plants.", symptoms: ["round spots", "red margins", "leaf thinning"], treatment: "Increase spacing, remove debris, apply trichoderma compost tea or copper spray.", severity: "medium" },
  { name: "Bacterial leaf spot", description: "Water-soaked lesions that become dark, greasy, and angular.", symptoms: ["water-soaked spots", "black lesions", "leaf yellowing"], treatment: "Avoid splashing water, isolate plant, remove infected leaves, use copper bactericide carefully.", severity: "high" },
  { name: "Anthracnose", description: "Sunken dark lesions on leaves, stems, and fruits, especially in mango, chilli, and papaya.", symptoms: ["sunken lesions", "black spots", "fruit rot"], treatment: "Prune infected parts, keep canopy dry, apply copper or biological fungicide after rain.", severity: "high" },
  { name: "Root rot", description: "Roots turn brown and mushy due to waterlogged soil and fungal pathogens.", symptoms: ["wilting despite wet soil", "mushy roots", "stunted growth"], treatment: "Stop watering, improve drainage, repot with sterile mix, drench with trichoderma.", severity: "high" },
  { name: "Stem rot", description: "Soft dark decay at stem base caused by excessive moisture and pathogens.", symptoms: ["soft stem base", "plant collapse", "bad smell"], treatment: "Cut healthy sections for propagation, discard rotten soil, improve drainage and airflow.", severity: "high" },
  { name: "Damping off", description: "Seedlings collapse at soil line due to fungal infection in wet seed trays.", symptoms: ["seedling collapse", "thin stem base", "patchy germination"], treatment: "Use sterile seed mix, water lightly, add cinnamon or trichoderma, increase light.", severity: "high" },
  { name: "Fusarium wilt", description: "Soil-borne wilt disease causing one-sided yellowing and vascular browning.", symptoms: ["wilting", "yellow lower leaves", "brown stem vessels"], treatment: "Remove infected plants, solarize soil, use resistant varieties and trichoderma-rich compost.", severity: "high" },
  { name: "Verticillium wilt", description: "Persistent wilt with V-shaped yellow patches beginning on older leaves.", symptoms: ["v-shaped yellowing", "daytime wilt", "stunted plant"], treatment: "Remove infected plant material, avoid susceptible crops, improve soil biology.", severity: "high" },
  { name: "Rust disease", description: "Orange, yellow, or brown pustules on leaf undersides in roses, beans, and ornamentals.", symptoms: ["orange pustules", "yellow specks", "leaf drop"], treatment: "Remove infected leaves, keep foliage dry, spray sulfur or neem oil at safe dilution.", severity: "medium" },
  { name: "Sooty mold", description: "Black surface coating caused by honeydew from aphids, mealybugs, or scale.", symptoms: ["black leaf coating", "sticky leaves", "reduced shine"], treatment: "Wash leaves gently, control sap-sucking pests with neem oil and soap spray.", severity: "low" },
  { name: "Mosaic virus", description: "Viral mottling with distorted growth in tulsi, chilli, cucumber, and tomato.", symptoms: ["mottled leaves", "distortion", "stunted growth"], treatment: "Remove infected plant, control aphids and whiteflies, disinfect tools.", severity: "high" },
  { name: "Yellow vein mosaic", description: "Bright yellow vein clearing common in bhindi and hibiscus relatives.", symptoms: ["yellow veins", "small leaves", "poor flowering"], treatment: "Remove infected leaves or plant, control whiteflies, use reflective mulch for vegetables.", severity: "high" },
  { name: "Tomato early blight", description: "Lower tomato leaves develop concentric brown lesions and yellow halos.", symptoms: ["lower leaf spots", "target rings", "defoliation"], treatment: "Prune lower leaves, stake plant, mulch soil, spray copper or neem preventively.", severity: "medium" },
  { name: "Tomato late blight", description: "Fast-spreading dark lesions with white fungal edge in cool wet weather.", symptoms: ["dark wet patches", "white fuzzy edge", "fruit rot"], treatment: "Remove infected plant parts quickly, keep dry, apply copper fungicide before spread.", severity: "high" },
  { name: "Chilli leaf curl virus", description: "Upward curling, thickened leaves, and stunted chilli growth spread by whiteflies.", symptoms: ["leaf curl", "stunted chilli", "poor fruiting"], treatment: "Control whiteflies, remove heavily infected plants, use yellow sticky traps.", severity: "high" },
  { name: "Rose black spot", description: "Circular black spots with fringed edges on rose leaves during humid weather.", symptoms: ["black spots", "yellow rose leaves", "leaf drop"], treatment: "Remove fallen leaves, water roots only, spray neem oil or sulfur fungicide.", severity: "medium" },
  { name: "Rose dieback", description: "Rose stems blacken from pruning cuts or tips and move downward.", symptoms: ["black stem tips", "dry canes", "poor shoots"], treatment: "Prune below black tissue, seal cuts, sterilize tools, feed balanced compost.", severity: "medium" },
  { name: "Tulsi leaf spot", description: "Brown to black leaf spots on holy basil due to fungal or bacterial infection.", symptoms: ["spotted tulsi leaves", "yellowing", "leaf shedding"], treatment: "Harvest affected leaves, improve sun and airflow, spray diluted neem in evening.", severity: "medium" },
  { name: "Neem leaf gall", description: "Raised galls or swellings on neem leaves caused by insects or mites.", symptoms: ["leaf galls", "distorted leaves", "rough texture"], treatment: "Prune affected leaves, encourage predators, apply neem seed kernel extract if spreading.", severity: "low" },
  { name: "Mango anthracnose", description: "Black spots on mango leaves, flowers, and young fruits in humid conditions.", symptoms: ["flower blight", "black fruit spots", "twig dieback"], treatment: "Prune canopy, remove mummified fruits, apply copper spray before flowering rain.", severity: "high" },
  { name: "Mango powdery mildew", description: "White fungal coating on mango panicles reducing fruit set.", symptoms: ["white panicles", "flower drop", "poor fruit set"], treatment: "Improve sunlight, prune dense growth, use sulfur spray during early infection.", severity: "medium" },
  { name: "Citrus canker", description: "Raised corky lesions with yellow halos on citrus leaves, stems, and fruits.", symptoms: ["corky spots", "yellow halo", "fruit blemishes"], treatment: "Prune infected twigs, sanitize tools, apply copper spray before monsoon.", severity: "high" },
  { name: "Citrus greening", description: "Uneven yellow mottling and bitter small fruits caused by psyllid-transmitted bacteria.", symptoms: ["blotchy mottling", "small bitter fruit", "twig dieback"], treatment: "Control psyllids, remove severely infected trees, improve nutrition and soil health.", severity: "high" },
  { name: "Banana sigatoka", description: "Elongated streaks on banana leaves that expand into necrotic patches.", symptoms: ["leaf streaks", "brown patches", "reduced bunch size"], treatment: "Remove diseased leaves, improve spacing, feed potassium, avoid overhead irrigation.", severity: "medium" },
  { name: "Banana panama wilt", description: "Fusarium disease causing yellowing, splitting pseudostem, and plant collapse.", symptoms: ["yellow banana leaves", "stem splitting", "wilt"], treatment: "Remove infected plants, avoid moving soil, use resistant varieties and clean tools.", severity: "high" },
  { name: "Papaya ringspot virus", description: "Mosaic leaves and ring spots on papaya fruit spread by aphids.", symptoms: ["ring spots", "mosaic leaves", "stunted papaya"], treatment: "Remove infected plants, control aphids, plant barrier crops and healthy seedlings.", severity: "high" },
  { name: "Aloe soft rot", description: "Watery foul-smelling rot in aloe caused by overwatering and bacterial infection.", symptoms: ["mushy aloe leaves", "bad smell", "transparent tissue"], treatment: "Remove rotten leaves, dry plant, repot in gritty mix, water sparingly.", severity: "high" },
  { name: "Money plant root rot", description: "Pothos roots decay from stagnant water or dense soggy soil.", symptoms: ["yellow pothos leaves", "black roots", "wilting vines"], treatment: "Trim rotten roots, change water or soil, use airy mix, reduce watering frequency.", severity: "medium" },
  { name: "Peace lily leaf scorch", description: "Brown leaf edges from low humidity, salts, or harsh sun.", symptoms: ["brown tips", "crispy edges", "drooping"], treatment: "Use filtered water, increase humidity, keep in bright indirect light.", severity: "low" },
  { name: "Snake plant basal rot", description: "Base turns soft from overwatering in low light.", symptoms: ["mushy base", "falling leaves", "yellowing"], treatment: "Cut healthy leaves for propagation, repot dry, water only after soil dries fully.", severity: "high" },
  { name: "Hibiscus mealybug stress", description: "White cottony pests cause curled hibiscus leaves and weak flowering.", symptoms: ["white cotton clusters", "sticky leaves", "bud drop"], treatment: "Wipe pests with alcohol swab, spray neem and soap weekly, prune dense shoots.", severity: "medium" },
  { name: "Jasmine bud blight", description: "Flower buds brown and fail to open in humid fungal conditions.", symptoms: ["brown buds", "bud drop", "grey fuzz"], treatment: "Remove affected buds, improve morning sun, water roots, apply biofungicide.", severity: "medium" },
  { name: "Marigold alternaria", description: "Dark leaf spots and flower blemishes during humid monsoon periods.", symptoms: ["leaf spots", "petal browning", "weak bloom"], treatment: "Deadhead infected flowers, space plants, apply neem or copper spray.", severity: "medium" },
  { name: "Bougainvillea leaf spot", description: "Fungal spots and yellowing caused by high moisture around foliage.", symptoms: ["brown spots", "yellow leaves", "leaf drop"], treatment: "Move to stronger sun, prune for airflow, avoid wetting leaves.", severity: "low" },
  { name: "Curry leaf dieback", description: "Twig tips dry back due to fungal infection, stress, or poor drainage.", symptoms: ["dry twig tips", "yellowing", "leaf drop"], treatment: "Prune to green wood, feed compost, improve drainage, spray neem oil.", severity: "medium" },
  { name: "Mint rust", description: "Orange-brown pustules on mint leaves, often in crowded moist pots.", symptoms: ["rust pustules", "yellow mint leaves", "weak aroma"], treatment: "Cut mint back hard, discard infected leaves, improve sun and airflow.", severity: "medium" },
  { name: "Coriander stem rot", description: "Coriander collapses from soil-borne fungi in overwatered containers.", symptoms: ["stem collapse", "wilting", "brown base"], treatment: "Thin seedlings, water lightly, use fresh soil and trichoderma compost.", severity: "medium" },
  { name: "Spinach leaf miner damage", description: "White winding trails in spinach leaves caused by larvae feeding inside tissue.", symptoms: ["white trails", "blotches", "leaf tunneling"], treatment: "Remove mined leaves, cover with net, use neem spray to deter adults.", severity: "low" },
  { name: "Aphid infestation", description: "Clusters of soft insects on new growth causing curling and sticky honeydew.", symptoms: ["curled tips", "sticky leaves", "tiny green insects"], treatment: "Spray water jet, apply neem and mild soap, encourage ladybird beetles.", severity: "medium" },
  { name: "Whitefly infestation", description: "Tiny white flying insects under leaves spread viral diseases and weaken plants.", symptoms: ["white flies", "yellow speckles", "sticky leaves"], treatment: "Use yellow sticky traps, spray neem underside of leaves, remove heavily infected foliage.", severity: "medium" },
  { name: "Spider mite damage", description: "Fine webbing and pale stippling in hot dry conditions.", symptoms: ["webbing", "speckled leaves", "bronze patches"], treatment: "Increase humidity, rinse leaves, spray neem or horticultural oil repeatedly.", severity: "medium" },
  { name: "Scale insect infestation", description: "Hard or soft bumps on stems sucking sap and causing yellowing.", symptoms: ["brown bumps", "sticky leaves", "weak growth"], treatment: "Scrape gently, dab alcohol, apply neem oil over several weeks.", severity: "medium" },
  { name: "Mealybug infestation", description: "Cottony white pests in leaf joints and roots of ornamentals.", symptoms: ["cottony masses", "sticky residue", "leaf distortion"], treatment: "Isolate plant, wipe pests, treat with neem and soap spray weekly.", severity: "medium" },
  { name: "Thrips damage", description: "Silvery streaks, black specks, and distorted flowers or leaves.", symptoms: ["silver streaks", "black specks", "distorted blooms"], treatment: "Remove damaged flowers, use blue sticky traps, spray spinosad or neem carefully.", severity: "medium" },
  { name: "Nitrogen deficiency", description: "Older leaves turn pale yellow while new growth remains smaller.", symptoms: ["older yellow leaves", "slow growth", "pale plant"], treatment: "Apply compost, vermicompost tea, or balanced organic fertilizer in small doses.", severity: "low" },
  { name: "Iron deficiency", description: "New leaves yellow between green veins, common in alkaline soil or hard water.", symptoms: ["yellow new leaves", "green veins", "pale shoots"], treatment: "Use chelated iron, compost, rainwater when possible, avoid overliming.", severity: "low" },
  { name: "Magnesium deficiency", description: "Older leaves show interveinal yellowing with green veins.", symptoms: ["interveinal yellowing", "older leaf chlorosis", "leaf drop"], treatment: "Apply diluted Epsom salt once monthly and improve balanced feeding.", severity: "low" },
  { name: "Potassium deficiency", description: "Leaf edges scorch and flowering or fruiting weakens.", symptoms: ["brown margins", "weak flowers", "poor fruiting"], treatment: "Add banana peel compost, wood ash in tiny amounts, or potassium-rich organic feed.", severity: "low" },
  { name: "Sunburn scorch", description: "Bleached or crispy patches after sudden exposure to harsh afternoon sun.", symptoms: ["bleached patches", "crispy leaves", "brown burns"], treatment: "Move to filtered light, acclimatize gradually, trim badly burned leaves.", severity: "low" },
  { name: "Overwatering stress", description: "Yellowing, edema, fungus gnats, and drooping despite wet soil.", symptoms: ["wet soil", "yellow leaves", "drooping"], treatment: "Let soil dry, improve drainage holes, reduce watering and increase light.", severity: "medium" },
  { name: "Underwatering stress", description: "Dry soil, wilting, curled leaves, and crisp edges during heat.", symptoms: ["dry soil", "wilting", "crispy edges"], treatment: "Deep water slowly, mulch surface, move pot away from hot wind.", severity: "medium" }
];

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

async function embed(text: string): Promise<number[]> {
  const token = env("HUGGINGFACE_API_KEY");
  const response = await fetch("https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-mpnet-base-v2", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
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
  for (const disease of diseases) {
    const text = `${disease.name}. ${disease.description}. Symptoms: ${disease.symptoms.join(", ")}. Treatment: ${disease.treatment}`;
    const embedding = await embed(text);
    const { error } = await supabase.from("disease_patterns").upsert(
      { ...disease, embedding },
      { onConflict: "name" }
    );
    if (error) throw error;
    console.log(`Seeded disease pattern: ${disease.name}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
