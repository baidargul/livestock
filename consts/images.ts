import img202504202145187037 from "@/public/media/2025-04-20_21-45-18_7037.png";
import img202504202147119137 from "@/public/media/2025-04-20_21-47-11_9137.png";
import im202504202147447055 from "@/public/media/2025-04-20_21-47-44_7055.png";
import chicken from "@/public/media/chicken.png";
import chicken1 from "@/public/media/chicken1.png";
import chicken2 from "@/public/media/chicken2.png";
import chicken3 from "@/public/media/chicken3.png";
import chicken4 from "@/public/media/chicken4.png";
import cow from "@/public/media/cow.png";
import cow1 from "@/public/media/cow1.png";
import cow2 from "@/public/media/cow2.png";
import dog from "@/public/media/dog.png";
import dog1 from "@/public/media/dog1.png";
import cat from "@/public/media/cat.png";
import cat1 from "@/public/media/cat1.png";
import cat2 from "@/public/media/cat2.png";
import cat3 from "@/public/media/cat3.png";
import goat from "@/public/media/goat.png";
import goat1 from "@/public/media/goat1.png";
import goat2 from "@/public/media/goat2.png";
import goat3 from "@/public/media/goat3.png";
import sheep from "@/public/media/sheep.png";
import sheep1 from "@/public/media/sheep1.png";
import sheep2 from "@/public/media/sheep2.png";
import sheep3 from "@/public/media/sheep3.png";
import sheep4 from "@/public/media/sheep4.png";
import horse from "@/public/media/horse.png";
import horse1 from "@/public/media/horse1.png";
import horse2 from "@/public/media/horse2.png";
import horse3 from "@/public/media/horse3.png";
import duck from "@/public/media/duck.png";
import duck1 from "@/public/media/duck1.png";
import duck2 from "@/public/media/duck2.png";
import duck3 from "@/public/media/duck3.png";
import rabbit from "@/public/media/rabbit.png";
import rabbit1 from "@/public/media/rabbit1.png";
import rabbit2 from "@/public/media/rabbit2.png";
import rabbit3 from "@/public/media/rabbit3.png";
import favIcon from "@/public/logos/header.png";
import desktopIcon from "@/public/logos/logo.png";
import mobileIcon from "@/public/logos/fullHd.png";

export const images = {
  site: {
    logo: {
      favIcon: favIcon,
      desktopIcon: desktopIcon,
      mobileIcon: mobileIcon,
    },
    placeholders: {
      userProfile: "/placeholders/userprofile.gif",
      userCover: "/placeholders/cover.png",
      animal: "/placeholders/animalprofile.gif",
      animalCover: "/placeholders/cover.png",
    },
  },
  chickens: {
    covers: {
      1: img202504202145187037,
      2: img202504202147119137,
      3: im202504202147447055,
    },
    images: { 1: chicken, 2: chicken1, 3: chicken2, 4: chicken3, 5: chicken4 },
    breeds: [
      {
        name: "Rhode Island Red",
        images: [chicken1, chicken2],
        info: "A popular dual-purpose breed, valued for hardiness and egg-laying. Thrives in free-range environments and adapts to diverse climates.",
      },
      {
        name: "Leghorn",
        images: [chicken3, chicken4],
        info: "Known for exceptional egg production, lightweight and active. Friendly but flighty, they prefer space to roam.",
      },
      {
        name: "Plymouth Rock",
        images: [chicken, chicken1],
        info: "Hardy, calm breed excellent for meat and eggs, recognized by barred feathers. Docile, ideal for backyard flocks.",
      },
      {
        name: "Sussex",
        images: [chicken2, chicken3],
        info: "Versatile and friendly, good layers of large brown eggs with robust build for meat. Adapts to confinement or range.",
      },
      {
        name: "Orpington",
        images: [chicken4, chicken],
        info: "Heavy, fluffy birds prized for meat and medium egg production. Calm temperament and cold-tolerant plumage.",
      },
      {
        name: "Wyandotte",
        images: [chicken1, chicken3],
        info: "With rose comb and laced feathers, Wyandottes are robust layers and good meat birds. Docile and cold-hardy.",
      },
      {
        name: "Australorp",
        images: [chicken2, chicken4],
        info: "Australian breed famed for egg-laying records. Medium-sized, calm, strong foragers, producing light-brown eggs.",
      },
      {
        name: "Brahma",
        images: [chicken, chicken2],
        info: "Large feather-footed 'King of Chickens', valued for meat and winter egging. Gentle giants handling cold well.",
      },
      {
        name: "Silkie",
        images: [chicken1, chicken4],
        info: "Distinctive fluffy plumage and black skin, valued as ornamental and pet breed. Gentle and broody mothers.",
      },
      {
        name: "Cochin",
        images: [chicken2, chicken3],
        info: "Massive, feather-footed birds with profuse plumage. Calm temperament, often kept for show and exhibition.",
      },
      {
        name: "Jersey Giant",
        images: [chicken3, chicken],
        info: "One of the largest chicken breeds, developed for meat. Gentle giants with steady growth and dark plumage.",
      },
      {
        name: "Marans",
        images: [chicken4, chicken1],
        info: "French breed known for dark chocolate-brown eggs. Hardy, active foragers with striking feather patterns.",
      },
      {
        name: "Polish",
        images: [chicken1, chicken2],
        info: "Ornamental breed with large crest of feathers. Friendly but can be skittish; kept for show and novelty.",
      },
      {
        name: "Faverolles",
        images: [chicken2, chicken4],
        info: "French origin, dual-purpose with fluffy beards and muffs. Gentle nature and good foragers.",
      },
      {
        name: "Hamburg",
        images: [chicken3, chicken2],
        info: "Small, active breed known for spotted plumage and excellent egg layers. Alert and agile foragers.",
      },
      {
        name: "Easter Egger",
        images: [chicken4, chicken3],
        info: "Hybrid breed laying blue, green, or pinkish eggs. Friendly and hardy, with varied feather colors.",
      },
      {
        name: "Silkie Bantam",
        images: [chicken1, chicken3],
        info: "Miniature version of Silkie, retains fluffy plumage and calm personality. Popular as pets and show birds.",
      },
      {
        name: "Aseel",
        images: [chicken2, chicken1],
        info: "Native to the Indian subcontinent, Aseels are gamefowl known for strength and endurance. Upright stance with muscular build.",
      },
      {
        name: "Kadaknath",
        images: [chicken3, chicken4],
        info: "Indian breed with black feathers and meat, rich in iron. Hardy and well-adapted to local climates in Pakistan and India.",
      },
      {
        name: "Naked Neck (Turken)",
        images: [chicken4, chicken],
        info: "Recognizable by featherless neck, Turken chickens tolerate heat well. Good layers and meat birds in tropical regions.",
      },
      {
        name: "Fayoumi",
        images: [chicken1, chicken4],
        info: "Egyptian heritage breed, small and hardy. Early maturity with good egg production and strong disease resistance.",
      },
      {
        name: "Ancona",
        images: [chicken2, chicken3],
        info: "Italian origin, known for mottled black-and-white plumage. Active foragers with high egg production.",
      },
      {
        name: "Cornish",
        images: [chicken3, chicken4],
        info: "English meat breed forming the basis of broiler chickens. Broad, muscular build and fast growth.",
      },
      {
        name: "Dorking",
        images: [chicken4, chicken1],
        info: "Ancient British breed with five toes, valued for tender meat and decent egg laying. Docile and hardy.",
      },
      {
        name: "Sumatra",
        images: [chicken1, chicken2],
        info: "Southeast Asian ornamental breed with glossy black feathers. Agile and used historically in cockfights.",
      },
      {
        name: "Ayam Cemani",
        images: [chicken2, chicken4],
        info: "Indonesian 'all-black' breed with melanistic features. Exotic and valued for ornamental and cultural significance.",
      },
      {
        name: "Malay",
        images: [chicken3, chicken1],
        info: "Tall, gamefowl-type breed from Asia, muscular with upright posture. Hardy and historically used for sport.",
      },
      {
        name: "Orloff",
        images: [chicken4, chicken2],
        info: "Russian breed with distinctive beard and muff. Cold-hardy, with moderate egg production and ornamental appeal.",
      },
    ],
  },
  cows: {
    images: { 1: cow, 2: cow1, 3: cow2 },
    breeds: [
      {
        name: "Holstein",
        images: [cow1, cow2],
        info: "The top global dairy producer, Holsteins yield large volumes of milk. Recognizable by their black-and-white markings and thrive under intensive dairy management.",
      },
      {
        name: "Jersey",
        images: [cow, cow1],
        info: "Small-framed yet high in butterfat, Jersey cows produce rich dairy ideal for cheese and butter. Gentle and efficient grazers adaptable to diverse climates.",
      },
      {
        name: "Guernsey",
        images: [cow1, cow2],
        info: "Known for golden-yellow milk high in beta-carotene, Guernseys are medium-sized dairy cows with docile temperaments, suited to pasture-based systems.",
      },
      {
        name: "Brown Swiss",
        images: [cow2, cow],
        info: "A hardy Swiss breed prized for milk high in protein ideal for cheese. Large and calm, they exhibit longevity and resilience in harsh conditions.",
      },
      {
        name: "Ayrshire",
        images: [cow1, cow2],
        info: "Originating from Scotland, Ayrshires are rugged foragers producing balanced milk. Energetic and hardy, they perform well in pasture-based dairies.",
      },
      {
        name: "Angus",
        images: [cow2, cow],
        info: "A premier beef breed, Angus cattle deliver well-marbled, tender meat. Hardy and adaptable, they excel in grass-fed and feedlot systems.",
      },
      {
        name: "Hereford",
        images: [cow1, cow2],
        info: "With red bodies and white faces, Herefords are efficient beef producers known for their docility and excellent foraging ability across climates.",
      },
      {
        name: "Simmental",
        images: [cow, cow1],
        info: "Dual-purpose Swiss breed valued for both meat and milk. Simmentals are large, fast-growing, and known for docility and adaptability.",
      },
      {
        name: "Charolais",
        images: [cow2, cow],
        info: "French beef breed recognized for muscular build and lean meat. Charolais cattle mature early and exhibit strong growth rates.",
      },
      {
        name: "Limousin",
        images: [cow1, cow2],
        info: "Golden-red French breed prized for lean, tender beef. Limousins are strong foragers, known for low birth weights and high yield carcasses.",
      },
      {
        name: "Dexter",
        images: [cow, cow2],
        info: "Small Irish dual-purpose breed, Dexters are versatile for milk and meat on small farms. Hardy and easy to handle with low-maintenance needs.",
      },
      {
        name: "Galloway",
        images: [cow1, cow],
        info: "Scottish breed with shaggy coat, Galloways are beef producers tolerant of cold climates. Known for lean, flavorful meat and resilience.",
      },
      {
        name: "Sahiwal",
        images: [cow2, cow1],
        info: "Pakistan’s leading dairy breed, Sahiwals produce high-quality milk in hot climates. Heat-tolerant and resistant to parasites with good feed conversion.",
      },
      {
        name: "Red Sindhi",
        images: [cow, cow2],
        info: "Native to Sindh, these red-brown cows excel in hot, humid conditions. Renowned for high butterfat milk and disease resistance.",
      },
      {
        name: "Cholistani",
        images: [cow1, cow2],
        info: "From Pakistan’s Cholistan desert, Cholistani cows are hardy dairy animals producing good milk under harsh conditions. Adaptable to arid regions.",
      },
      {
        name: "Tharparkar",
        images: [cow2, cow],
        info: "Also called White Sindhi, Tharparkar cattle provide milk and draft power. White-coated and heat-tolerant, they are integral to rural livelihoods.",
      },
      {
        name: "Dhanni",
        images: [cow1, cow],
        info: "A multipurpose Pakistani breed used for milk, meat, and draft. Dhanni cattle are hardy, medium-sized, and perform well on sparse grazing.",
      },
    ],
  },
  dogs: {
    images: { 1: dog, 2: dog1 },
    breeds: [
      {
        name: "Labrador Retriever",
        images: [dog1, dog],
        info: "Friendly, outgoing companions excelling in retrieving and service roles. Thrive with regular exercise and love family environments.",
      },
      {
        name: "German Shepherd",
        images: [dog, dog1],
        info: "Intelligent and versatile, used in police, military, and assistance work. Loyal, protective, and respond well to consistent training.",
      },
      {
        name: "Golden Retriever",
        images: [dog1, dog],
        info: "Gentle and intelligent family dogs known for patience and playfulness. Excel as therapy and service dogs with regular grooming needs.",
      },
      {
        name: "Poodle",
        images: [dog, dog1],
        info: "Highly trainable and hypoallergenic, available in standard, miniature, and toy sizes. Excel in obedience and agility sports.",
      },
      {
        name: "Bulldog",
        images: [dog1, dog],
        info: "Sturdy with wrinkled face and calm demeanor. Prefer moderate exercise and are well-suited to city living and apartments.",
      },
      {
        name: "Beagle",
        images: [dog, dog1],
        info: "Curious scent hounds with friendly temperament. Require mental stimulation and exercise; great family pets and tracking dogs.",
      },
      {
        name: "Dachshund",
        images: [dog1, dog],
        info: "Small dogs with long bodies and short legs, originally bred for badger hunting. Lively and stubborn, with moderate exercise needs.",
      },
      {
        name: "Boxer",
        images: [dog, dog1],
        info: "Energetic and playful, known for protective nature and strong bonds with families. Require regular exercise and early socialization.",
      },
      {
        name: "Rottweiler",
        images: [dog1, dog],
        info: "Confident and strong, used in guarding and service roles. Require firm training and socialization; loyal family companions.",
      },
      {
        name: "Siberian Husky",
        images: [dog, dog1],
        info: "Medium-sized working dogs with thick coats and striking eyes. Bred for sledding, they need vigorous exercise and cold climates.",
      },
      {
        name: "Shih Tzu",
        images: [dog1, dog],
        info: "Small companion dogs with luxurious coats. Affectionate and friendly, suited to indoor living with regular grooming.",
      },
      {
        name: "Pug",
        images: [dog, dog1],
        info: "Compact dogs with wrinkled faces and curled tails. Sociable and affectionate, require minimal exercise but careful heat management.",
      },
      {
        name: "Doberman Pinscher",
        images: [dog1, dog],
        info: "Sleek and powerful, known for loyalty and guarding instincts. Trainable and energetic, they excel in protection tasks.",
      },
      {
        name: "Great Dane",
        images: [dog, dog1],
        info: "One of the tallest breeds, gentle giants with calm temperament. Require space and moderate exercise; good with families.",
      },
      {
        name: "Pomeranian",
        images: [dog1, dog],
        info: "Tiny Spitz-type dogs with fluffy coats. Alert and lively, they make great companions but need regular coat maintenance.",
      },
      {
        name: "Chihuahua",
        images: [dog, dog1],
        info: "Smallest dog breed, known for big personalities. Loyal and vigilant, suited to indoor living with minimal exercise.",
      },
      {
        name: "Mixed-breed",
        images: [dog1, dog],
        info: "Dogs of diverse ancestry, often with hybrid vigor leading to good health. Varied sizes and temperaments, popular as family pets.",
      },
    ],
  },
  cats: {
    images: { 1: cat, 2: cat1, 3: cat2, 4: cat3 },
    breeds: [
      {
        name: "Persian",
        images: [cat1, cat2],
        info: "Known for long, luxurious coats and calm personalities. Require regular grooming and thrive as indoor companions.",
      },
      {
        name: "Siamese",
        images: [cat3, cat1],
        info: "Vocal and affectionate with sleek bodies and striking blue almond-shaped eyes. Thrive on interaction and mental stimulation.",
      },
      {
        name: "Maine Coon",
        images: [cat2, cat1],
        info: "One of the largest domestic breeds, Maine Coons have tufted ears and bushy tails. Friendly, intelligent, and great with families.",
      },
      {
        name: "Bengal",
        images: [cat, cat2],
        info: "Resembling wild cats with spotted or marbled coats, Bengals are active and playful. Require space and stimulation to prevent boredom.",
      },
      {
        name: "Sphynx",
        images: [cat3, cat],
        info: "Hairless and affectionate, Sphynx cats have a unique appearance and require regular skin care. Social and enjoy human company.",
      },
      {
        name: "Ragdoll",
        images: [cat1, cat3],
        info: "Large, gentle cats known for going limp when picked up. Ragdolls are affectionate, quiet, and ideal for calm family environments.",
      },
      {
        name: "British Shorthair",
        images: [cat2, cat1],
        info: "Stocky cats with dense coats and round faces. Easygoing and adapt well to indoor living with moderate activity needs.",
      },
      {
        name: "Russian Blue",
        images: [cat, cat3],
        info: "Elegant cats with silvery-blue coats and green eyes. Intelligent and gentle, they bond closely with their owners.",
      },
      {
        name: "Scottish Fold",
        images: [cat1, cat2],
        info: "Known for distinctive folded ears and rounded faces. Affectionate and calm, they require minimal grooming.",
      },
      {
        name: "Savannah",
        images: [cat3, cat],
        info: "Hybrid of domestic cat and serval, tall and slender with spotted coat. Energetic and curious, suited to experienced cat owners.",
      },
      {
        name: "Abyssinian",
        images: [cat2, cat1],
        info: "One of the oldest cat breeds, Abyssinians have ticked coats and playful personalities. Highly active and intelligent.",
      },
      {
        name: "Birman",
        images: [cat1, cat3],
        info: "Known as the 'Sacred Cat of Burma' with color-pointed coats and white gloves. Gentle, social, and good with families.",
      },
      {
        name: "American Shorthair",
        images: [cat, cat2],
        info: "Well-rounded cats with short coats and sturdy builds. Known for friendly nature and adaptability to varied environments.",
      },
    ],
  },
  goats: {
    images: { 1: goat, 2: goat1, 3: goat2, 4: goat3 },
    breeds: [
      {
        name: "Boer",
        images: [goat1, goat2],
        info: "Premier meat goat from South Africa, muscular with rapid growth. Docile, hardy, great for grazing.",
      },
      {
        name: "Nubian",
        images: [goat3, goat1],
        info: "Large ears and Roman nose, dual-purpose for milk and meat. Milk high in butterfat with rich flavor.",
      },
      {
        name: "Alpine",
        images: [goat1, goat2],
        info: "French dairy breed adaptable to varied climates. Good milkers with strong foraging abilities.",
      },
      {
        name: "Saanen",
        images: [goat2, goat3],
        info: "Swiss white goats known for high milk yield and gentle temperament. Suit intensive and pasture systems.",
      },
      {
        name: "Toggenburg",
        images: [goat3, goat1],
        info: "Oldest dairy breed from Switzerland, distinguished by brown coat and white markings. Consistent milkers.",
      },
      {
        name: "Jamunapari",
        images: [goat, goat2],
        info: "Indian meat and dairy breed with distinctive long legs and pendulous ears. High milk yield in hot climates.",
      },
      {
        name: "Beetal",
        images: [goat1, goat3],
        info: "Pakistani multipurpose breed known for milk, meat, and hide. Hardy and prolific, with good growth rates.",
      },
      {
        name: "Teddy",
        images: [goat2, goat1],
        info: "Small Pakistani breed used for milk, known for high butterfat content. Docile and well-suited to small farms.",
      },
      {
        name: "Black Bengal",
        images: [goat3, goat2],
        info: "Bangladeshi breed valued for meat quality and skin. Compact size, disease-resistant, and prolific breeders.",
      },
      {
        name: "Kiko",
        images: [goat, goat3],
        info: "New Zealand breed developed for meat production. Hardy, fast-growing, and resistant to parasites.",
      },
      {
        name: "LaMancha",
        images: [goat1, goat],
        info: "American dairy breed noted for very short or absent ears. Friendly temperament and high butterfat milk.",
      },
      {
        name: "Oberhasli",
        images: [goat2, goat3],
        info: "Swiss dairy breed with unique bay color and black markings. Calm and productive milkers.",
      },
      {
        name: "Myotonic (Fainting)",
        images: [goat3, goat1],
        info: "Known as Fainting goats for muscle stiffness when startled. Raised for meat and novelty.",
      },
      {
        name: "Pygmy",
        images: [goat1, goat2],
        info: "Small African breed popular as pets and for meat. Hardy, friendly, and well-suited to backyard farms.",
      },
      {
        name: "Spanish",
        images: [goat2, goat3],
        info: "Also called brush goats, common in the US for meat. Hardy, adaptable, and low-maintenance foragers.",
      },
      {
        name: "Kalahari Red",
        images: [goat, goat1],
        info: "South African meat breed with red coat and tolerance to heat. Efficient converters of poor forage.",
      },
      {
        name: "Sirohi",
        images: [goat2, goat1],
        info: "Indian dual-purpose breed from Rajasthan, known for heat tolerance and reasonable milk and meat yields.",
      },
      {
        name: "Nachi",
        images: [goat3, goat2],
        info: "Pakistani goat from Balochistan region, valued for meat quality and adaptability to arid climates.",
      },
      {
        name: "Pateri",
        images: [goat1, goat3],
        info: "Local Pakistani breed from Sindh, prized for milk production and resilience in hot environments.",
      },
    ],
  },
  sheeps: {
    images: { 1: sheep, 2: sheep1, 3: sheep2, 4: sheep3, 5: sheep4 },
    breeds: [
      {
        name: "Merino",
        images: [sheep1, sheep2],
        info: "World-renowned for fine, soft wool. Merinos thrive in varied climates and are highly adaptable, making their fleece ideal for quality textiles.",
      },
      {
        name: "Suffolk",
        images: [sheep3, sheep4],
        info: "A leading meat breed with black face and legs. Suffolks grow quickly, are hardy, and yield lean, tender carcasses.",
      },
      {
        name: "Dorset",
        images: [sheep1, sheep2],
        info: "Dual-purpose for meat and wool. Dorsets breed out of season and are valued for prolific lambing and quality fleece.",
      },
      {
        name: "Texel",
        images: [sheep4, sheep3],
        info: "Developed in the Netherlands for high muscle yield. Texels have lean meat, strong legs, and are efficient feed converters.",
      },
      {
        name: "Romney",
        images: [sheep2, sheep1],
        info: "Versatile for wet climates, Romneys produce medium-grade wool and quality meat. Known for strong flocking instincts.",
      },
      {
        name: "Cheviot",
        images: [sheep3, sheep2],
        info: "Originating from Scottish borders, Cheviots are hardy, alert, and produce firm-bodied carcasses and white wool.",
      },
      {
        name: "Karakul",
        images: [sheep4, sheep1],
        info: "Central Asian breed, famous for pelts of young lambs. Karakuls are drought-tolerant and provide both meat and fur.",
      },
      {
        name: "Awassi",
        images: [sheep1, sheep3],
        info: "Middle Eastern dairy breed, valued for high milk yield in arid regions. Awassis are hardy and adaptable.",
      },
      {
        name: "Maldah (Masham)",
        images: [sheep2, sheep4],
        info: "Pakistani Masham sheep are dual-purpose, with coarse wool and good meat. Well-suited to local grazing conditions.",
      },
      {
        name: "Sand Macka",
        images: [sheep3, sheep1],
        info: "Indigenous to Pakistan’s Sindh region, Sand Mackas are hardy, heat-tolerant sheep raised for meat in arid zones.",
      },
      {
        name: "Balochi",
        images: [sheep4, sheep2],
        info: "From Balochistan, these sheep are valued for meat and medium-grade wool. Adapted to harsh, dry climates.",
      },
      {
        name: "Karachiwool",
        images: [sheep1, sheep4],
        info: "Breeds from Karachi region, known for coarse wool and resilience. Kept primarily for local meat and fiber.",
      },
      {
        name: "Punjab",
        images: [sheep2, sheep3],
        info: "Found in Punjab region, these sheep yield medium wool and quality mutton. Hardy and adaptable to pasture.",
      },
    ],
  },
  horses: {
    images: { 1: horse, 2: horse1, 3: horse2, 4: horse3 },
    breeds: [
      {
        name: "Arabian",
        images: [horse1, horse2],
        info: "Ancient desert breed known for endurance, refinement, and spirited nature. Distinctive dished face and high stamina.",
      },
      {
        name: "Thoroughbred",
        images: [horse3, horse1],
        info: "Racehorse breed prized for speed and athleticism. Tall, slim, and spirited performers in global racing events.",
      },
      {
        name: "Quarter Horse",
        images: [horse2, horse1],
        info: "American breed excelling in sprinting short distances and ranch work. Compact, muscular, known for calm disposition.",
      },
      {
        name: "Clydesdale",
        images: [horse3, horse2],
        info: "Draft breed recognized by feathered legs and large build. Gentle temperament, used for heavy agricultural work and shows.",
      },
      {
        name: "Appaloosa",
        images: [horse1, horse3],
        info: "Spotted coat patterns, versatile in various disciplines. Hardy, sure-footed, with strong tribal heritage of the Nez Perce.",
      },
      {
        name: "Warmblood",
        images: [horse2, horse3],
        info: "European sport horse combining strength and agility. Popular in dressage and show jumping with balanced temperament.",
      },
      {
        name: "Mustang",
        images: [horse3, horse1],
        info: "Feral horse of the American West, known for hardiness and adaptability. Intelligent and sure-footed survivors.",
      },
      {
        name: "Friesian",
        images: [horse1, horse2],
        info: "Dutch breed with black coat and flowing mane. Elegant carriage horses in driving and dressage, gentle and trainable.",
      },
      {
        name: "Andalusian",
        images: [horse2, horse3],
        info: "Spanish breed famed for baroque build and high-stepping gait. Intelligent and versatile in classical riding disciplines.",
      },
      {
        name: "Shire",
        images: [horse3, horse2],
        info: "One of the tallest draft breeds, Shires are powerful and calm. Used historically for pulling heavy loads and farm work.",
      },
      {
        name: "Marwari",
        images: [horse1, horse3],
        info: "Indian breed with inward-curving ears. Hardy desert horses valued for loyalty and resilience in arid regions.",
      },
      {
        name: "Kathiawari",
        images: [horse2, horse1],
        info: "Native to India’s Kathiawar peninsula, known for dun coat and inward-curving ears. Used as cavalry mounts and in local ceremonies.",
      },
      {
        name: "Karabakh",
        images: [horse3, horse1],
        info: "Ancient breed from the Caucasus, renowned for endurance and agility in mountainous terrain. Medium build with distinctive golden coat.",
      },
    ],
  },
  ducks: {
    images: { 1: duck, 2: duck1, 3: duck2, 4: duck3 },
    breeds: [
      {
        name: "Pekin",
        images: [duck1, duck2],
        info: "Popular meat and exhibition duck, white plumage and rapid growth. Calm and easy to raise in various conditions.",
      },
      {
        name: "Muscovy",
        images: [duck3, duck1],
        info: "Meat duck with leaner profile, known as Barbary duck. Quiet ducks with minimal quacking and hardy nature.",
      },
      {
        name: "Indian Runner",
        images: [duck1, duck2],
        info: "Upright carriage resembling wine bottles, excellent foragers and prolific egg layers with active temperament.",
      },
      {
        name: "Mallard",
        images: [duck2, duck3],
        info: "Wild ancestor of most domestic ducks, drakes have green heads. Hardy and adaptable to diverse environments.",
      },
      {
        name: "Khaki Campbell",
        images: [duck1, duck3],
        info: "British breed developed for egg production, laying over 200 eggs per year. Light-bodied and active foragers.",
      },
      {
        name: "Rouen",
        images: [duck2, duck1],
        info: "French exhibition breed resembling Mallard but larger. Valued for table use and ornamental purposes.",
      },
      {
        name: "Call Duck",
        images: [duck3, duck2],
        info: "Diminutive bantam breed known for loud call. Kept as pets and for exhibition with friendly disposition.",
      },
      {
        name: "Silver Appleyard",
        images: [duck1, duck2],
        info: "English dual-purpose breed, handsome plumage and good meat and egg production. Hardy and calm.",
      },
      {
        name: "Anas clypeata (Shoveler)",
        images: [duck2, duck3],
        info: "Wild diving duck with broad bill, introduced occasionally in captivity. Known for dabbling feeding behavior.",
      },
    ],
  },
  rabbits: {
    images: { 1: rabbit, 2: rabbit1, 3: rabbit2, 4: rabbit3 },
    breeds: [
      {
        name: "Holland Lop",
        images: [rabbit1, rabbit2],
        info: "Small lop-eared breed with gentle temperament. Popular pets requiring minimal space.",
      },
      {
        name: "Netherland Dwarf",
        images: [rabbit3, rabbit1],
        info: "Tiny breed with upright ears, lively but can be temperamental. Low maintenance.",
      },
      {
        name: "Rex",
        images: [rabbit1, rabbit2],
        info: "Known for plush, velvet-like fur and docile nature. Medium size, good for pets and shows.",
      },
      {
        name: "New Zealand",
        images: [rabbit2, rabbit3],
        info: "Large, fast-growing meat and show breed. White coat and calm disposition.",
      },
      {
        name: "Flemish Giant",
        images: [rabbit3, rabbit1],
        info: "One of the largest breeds, often over 15 lbs. Gentle giants kept as pets and for meat.",
      },
      {
        name: "Angora",
        images: [rabbit1, rabbit3],
        info: "Wool-producing breed with long, silky fur. Requires regular grooming and shearings.",
      },
      {
        name: "Lionhead",
        images: [rabbit2, rabbit1],
        info: "Small breed with wool mane around head. Playful and friendly companions.",
      },
      {
        name: "French Lop",
        images: [rabbit3, rabbit2],
        info: "Large and heavy, French Lops have floppy ears and gentle dispositions. Good for families.",
      },
      {
        name: "English Spot",
        images: [rabbit1, rabbit2],
        info: "Recognized by distinctive body spots and herringbone spine marking. Energetic and curious.",
      },
      {
        name: "Mini Rex",
        images: [rabbit2, rabbit3],
        info: "Smaller version of Rex, with soft, dense fur. Friendly and easily handled.",
      },
      {
        name: "Dutch",
        images: [rabbit3, rabbit1],
        info: "Small, marked by characteristic bicolor pattern. Hardy and sociable pets.",
      },
      {
        name: "Harlequin",
        images: [rabbit1, rabbit2],
        info: "Distinctive multicolored coat pattern. Active, playful, and good-natured.",
      },
      {
        name: "Silver Fox",
        images: [rabbit2, rabbit3],
        info: "Large breed with silver-tipped fur. Hardy and dual-purpose for meat and fur.",
      },
      {
        name: "Chinchilla",
        images: [rabbit3, rabbit1],
        info: "Known for dense, gray fur resembling chinchilla. Valued for pelts and calm temperament.",
      },
    ],
  },
} as any;
