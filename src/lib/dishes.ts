export type DishAnswer = "real" | "fake";

export type Dish = {
  id: number;
  name: string;
  description: string;
  answer: DishAnswer;
  origin: string;
  category: string;
  reveal: string;
  fakeExplanation?: string;
  color: "tomato" | "mustard" | "sage" | "plum" | "ocean";
};

// 60 dishes: ids 1-30 are REAL, ids 31-60 are FAKE (ids are internal only —
// they are never shown to the player; the case-file number is a scramble).
// Colors cycle so every color is used by exactly 6 real and 6 fake dishes,
// so the badge color never predicts the answer.
// Fake origins are stored WITHOUT the surrounding quotation marks used in the
// source list: rendering them would instantly flag every fake dish.
export const DISHES: Dish[] = [
  {
    id: 1,
    name: "Stargazy Pie",
    description: "A baked pie topped with whole fish whose heads poke dramatically through the crust, appearing to stare toward the sky.",
    answer: "real",
    origin: "England",
    category: "Savory Pie",
    reveal: "REAL. Stargazy pie is a traditional Cornish dish associated with Mousehole. The fish heads are deliberately arranged through the pastry, creating its famously bizarre appearance.",
    color: "tomato",
  },
  {
    id: 2,
    name: "Casu Marzu",
    description: "A sheep's-milk cheese that is intentionally allowed to develop live insect larvae inside it.",
    answer: "real",
    origin: "Sardinia, Italy",
    category: "Cheese",
    reveal: "REAL. Casu marzu is a traditional Sardinian cheese whose distinctive texture comes from the activity of cheese-fly larvae. It has become one of the world's most notorious cheeses.",
    color: "mustard",
  },
  {
    id: 3,
    name: "Hákarl",
    description: "Shark meat that is cured and fermented before being eaten.",
    answer: "real",
    origin: "Iceland",
    category: "Fermented Food",
    reveal: "REAL. Hákarl is a traditional Icelandic food made from Greenland shark. The preservation process is essential because the fresh meat contains compounds that make it unsuitable to eat without proper preparation.",
    color: "sage",
  },
  {
    id: 4,
    name: "Century Egg",
    description: "An egg preserved until its white becomes dark and translucent and its yolk turns creamy and greenish-gray.",
    answer: "real",
    origin: "China",
    category: "Preserved Food",
    reveal: "REAL. Century eggs are preserved duck, chicken, or quail eggs. Despite the name, they aren't actually stored for a century; preservation usually takes weeks or months.",
    color: "plum",
  },
  {
    id: 5,
    name: "Balut",
    description: "A fertilized duck egg that is boiled and eaten from the shell.",
    answer: "real",
    origin: "Philippines",
    category: "Street Food",
    reveal: "REAL. Balut is a well-known Filipino street food and is also eaten in other parts of Southeast Asia. The developing embryo is part of the dish.",
    color: "ocean",
  },
  {
    id: 6,
    name: "Escamoles",
    description: "Tiny edible insect larvae harvested from the roots of agave plants and sometimes called \u201cinsect caviar.\u201d",
    answer: "real",
    origin: "Mexico",
    category: "Delicacy",
    reveal: "REAL. Escamoles are ant larvae traditionally harvested in Mexico. They are often cooked with butter, herbs, or spices and are considered a delicacy.",
    color: "tomato",
  },
  {
    id: 7,
    name: "Surströmming",
    description: "Baltic herring fermented in a can until it develops an extremely powerful smell.",
    answer: "real",
    origin: "Sweden",
    category: "Fermented Fish",
    reveal: "REAL. Surströmming is a traditional Swedish fermented herring. Its famously intense aroma has made opening the can something of an internet spectacle.",
    color: "mustard",
  },
  {
    id: 8,
    name: "Shirako",
    description: "A creamy Japanese delicacy made from the milt, or sperm sacs, of fish such as cod.",
    answer: "real",
    origin: "Japan",
    category: "Seafood",
    reveal: "REAL. Shirako is a traditional Japanese ingredient prized for its soft, creamy texture. The name literally refers to its pale appearance.",
    color: "sage",
  },
  {
    id: 9,
    name: "Kiviak",
    description: "Small seabirds traditionally fermented inside a seal skin for months.",
    answer: "real",
    origin: "Greenland",
    category: "Fermented Food",
    reveal: "REAL. Kiviak is a traditional Greenlandic Inuit food associated with winter celebrations. The preservation method developed in an Arctic environment where fresh food could be difficult to obtain seasonally.",
    color: "plum",
  },
  {
    id: 10,
    name: "Ant Egg Soup",
    description: "A soup or other dish containing edible ant eggs and larvae.",
    answer: "real",
    origin: "Thailand / Laos",
    category: "Soup",
    reveal: "REAL. Ant eggs and larvae are used in several Southeast Asian dishes, including soups and salads. They are considered a delicacy in parts of the region.",
    color: "ocean",
  },
  {
    id: 11,
    name: "Poutine",
    description: "French fries covered in cheese curds and gravy.",
    answer: "real",
    origin: "Canada",
    category: "Fast Food",
    reveal: "REAL. Poutine originated in Quebec and became one of Canada's best-known comfort foods. The combination sounds questionable until you realize millions of people deliberately order it.",
    color: "tomato",
  },
  {
    id: 12,
    name: "Smörgåstårta",
    description: "A giant layered \u201ccake\u201d made from bread, savory fillings, cream cheese, seafood, meat, and vegetables.",
    answer: "real",
    origin: "Sweden",
    category: "Savory Cake",
    reveal: "REAL. Smörgåstårta is a Swedish sandwich cake designed to look like a celebration cake while actually being a savory meal.",
    color: "mustard",
  },
  {
    id: 13,
    name: "Jellied Eels",
    description: "Eels cooked in a broth that naturally turns into a jelly as it cools.",
    answer: "real",
    origin: "England",
    category: "Seafood",
    reveal: "REAL. Jellied eels became particularly associated with London's East End. The gelatin from the eels creates the characteristic jelly.",
    color: "sage",
  },
  {
    id: 14,
    name: "Chaprah",
    description: "A fiery chutney made using red ants and their eggs, along with spices.",
    answer: "real",
    origin: "Chhattisgarh, India",
    category: "Chutney",
    reveal: "REAL. Chaprah is a traditional chutney associated with communities in central India, particularly Chhattisgarh. It is one of many regional foods unfamiliar to outsiders but culturally significant locally.",
    color: "plum",
  },
  {
    id: 15,
    name: "Pakhala Bhata",
    description: "Cooked rice soaked and fermented in water before being served chilled, often with accompaniments.",
    answer: "real",
    origin: "Odisha, India",
    category: "Rice Dish",
    reveal: "REAL. Pakhala bhata is a traditional Odia dish especially associated with hot weather. Fermenting the rice gives it a distinctive tangy character.",
    color: "ocean",
  },
  {
    id: 16,
    name: "Garlic Kheer",
    description: "A sweet milk-based pudding in which garlic is cooked down until it becomes part of the dessert.",
    answer: "real",
    origin: "India",
    category: "Dessert",
    reveal: "REAL. Garlic kheer is a documented traditional preparation found in parts of India. The garlic is cooked extensively, transforming its sharpness before being incorporated into the sweet dish.",
    color: "tomato",
  },
  {
    id: 17,
    name: "Bánh Xèo",
    description: "A crispy Vietnamese savory pancake filled with ingredients such as shrimp, pork, and bean sprouts.",
    answer: "real",
    origin: "Vietnam",
    category: "Pancake",
    reveal: "REAL. Bánh xèo gets its name from the sizzling sound the batter makes when it hits the hot pan. The result is a large, crisp, folded pancake.",
    color: "mustard",
  },
  {
    id: 18,
    name: "Pão de Deus",
    description: "A Portuguese sweet bread topped with a coconut mixture that gives it a cracked, golden crust.",
    answer: "real",
    origin: "Portugal",
    category: "Sweet Bread",
    reveal: "REAL. Pão de Deus literally translates to \u201cbread of God.\u201d It is a traditional Portuguese sweet bread commonly associated with All Saints' Day.",
    color: "sage",
  },
  {
    id: 19,
    name: "Funeral Potatoes",
    description: "A creamy, cheesy potato casserole with a name that sounds far more dramatic than its ingredients.",
    answer: "real",
    origin: "United States",
    category: "Casserole",
    reveal: "REAL. \u201cFuneral potatoes\u201d is a nickname for a type of comforting potato casserole traditionally served at gatherings in parts of the United States, including post-funeral meals.",
    color: "plum",
  },
  {
    id: 20,
    name: "Rocky Mountain Oysters",
    description: "A dish whose name sounds like seafood but contains no oysters whatsoever.",
    answer: "real",
    origin: "United States",
    category: "Meat Dish",
    reveal: "REAL. Rocky Mountain oysters are a traditional dish made from animal testicles, commonly associated with ranching regions of the western United States. The name is intentionally misleading.",
    color: "ocean",
  },
  {
    id: 21,
    name: "Haggis",
    description: "A traditional Scottish dish made using sheep's offal, oats, onions, and spices.",
    answer: "real",
    origin: "Scotland",
    category: "Savory Dish",
    reveal: "REAL. Haggis is one of Scotland's best-known traditional foods and is traditionally served with neeps and tatties.",
    color: "tomato",
  },
  {
    id: 22,
    name: "Black Pudding",
    description: "A breakfast sausage made partly with animal blood, fat, and grains.",
    answer: "real",
    origin: "United Kingdom / Ireland",
    category: "Sausage",
    reveal: "REAL. Black pudding is a traditional blood sausage commonly eaten as part of a British or Irish breakfast.",
    color: "mustard",
  },
  {
    id: 23,
    name: "Pigs in Blankets",
    description: "Small sausages wrapped in bacon and roasted together.",
    answer: "real",
    origin: "United Kingdom",
    category: "Side Dish",
    reveal: "REAL. Despite sounding like a children's bedtime story, pigs in blankets are a very real British side dish, especially popular around Christmas.",
    color: "sage",
  },
  {
    id: 24,
    name: "Mooncake with Salted Egg Yolk",
    description: "A sweet pastry containing one or more intensely salty egg yolks in its center.",
    answer: "real",
    origin: "China",
    category: "Dessert",
    reveal: "REAL. Salted egg yolk mooncakes are a traditional Mid-Autumn Festival food. The salty yolk contrasts with the sweet filling and pastry.",
    color: "plum",
  },
  {
    id: 25,
    name: "Black Sesame Soup",
    description: "A smooth, dark dessert soup made from ground black sesame seeds, sugar, and water or milk.",
    answer: "real",
    origin: "China",
    category: "Dessert Soup",
    reveal: "REAL. Black sesame soup is a traditional Chinese sweet served warm or chilled. Its almost-black appearance makes it look much more mysterious than it tastes.",
    color: "ocean",
  },
  {
    id: 26,
    name: "Salted Coffee",
    description: "Strong coffee topped with a creamy layer containing salt.",
    answer: "real",
    origin: "Vietnam",
    category: "Drink",
    reveal: "REAL. Salt coffee, or cà phê muối, is associated particularly with Hue in Vietnam. The salt is used to balance bitterness and enhance the coffee's flavor.",
    color: "tomato",
  },
  {
    id: 27,
    name: "Butter Tea",
    description: "Tea blended with butter and salt rather than sugar.",
    answer: "real",
    origin: "Tibet / Himalayan regions",
    category: "Drink",
    reveal: "REAL. Butter tea is a traditional drink in Tibetan culture and other Himalayan regions. The rich, salty drink provides warmth and calories in a cold environment.",
    color: "mustard",
  },
  {
    id: 28,
    name: "Ackee and Saltfish",
    description: "A breakfast dish pairing a tropical fruit with salted cod.",
    answer: "real",
    origin: "Jamaica",
    category: "Savory Dish",
    reveal: "REAL. Ackee and saltfish is Jamaica's national dish. The creamy ackee fruit is cooked with salted cod and savory ingredients.",
    color: "sage",
  },
  {
    id: 29,
    name: "Banana Ketchup",
    description: "A ketchup-like sauce made primarily from bananas instead of tomatoes.",
    answer: "real",
    origin: "Philippines",
    category: "Condiment",
    reveal: "REAL. Banana ketchup was developed in the Philippines, where bananas were abundant and tomatoes were historically harder to obtain. It became a popular condiment.",
    color: "plum",
  },
  {
    id: 30,
    name: "Ants on a Log",
    description: "Celery sticks filled with peanut butter and topped with raisins, creating tiny \u201cants\u201d walking across a log.",
    answer: "real",
    origin: "United States",
    category: "Snack",
    reveal: "REAL. Ants on a log is a classic American snack whose name comes entirely from the visual joke of raisins sitting on celery.",
    color: "ocean",
  },
  {
    id: 31,
    name: "Cloud Noodles",
    description: "Ultra-thin noodles served with whipped cream and powdered sugar, supposedly designed to resemble clouds.",
    answer: "fake",
    origin: "Northern France",
    category: "Pasta",
    reveal: "DELUSION. There is no traditional French dish by this name. It was invented by combining the visual idea of cloud-like desserts with noodles.",
    color: "tomato",
  },
  {
    id: 32,
    name: "Moonlight Soup",
    description: "A clear soup containing translucent noodles that supposedly glow faintly under moonlight.",
    answer: "fake",
    origin: "Japan",
    category: "Soup",
    reveal: "DELUSION. Beautiful name. Completely fictional dish. Unfortunately, your soup will not become magical under the moon.",
    color: "mustard",
  },
  {
    id: 33,
    name: "Chocolate Curry Cake",
    description: "A layered chocolate cake filled with spicy curry paste and topped with crispy onions.",
    answer: "fake",
    origin: "India",
    category: "Dessert",
    reveal: "DELUSION. This one is fictional. It sounds just plausible enough to make you question whether some experimental bakery somewhere has actually tried it.",
    color: "sage",
  },
  {
    id: 34,
    name: "Pickle Cappuccino",
    description: "Espresso topped with a foamy pickle-infused milk layer and a tiny pickle garnish.",
    answer: "fake",
    origin: "Italy",
    category: "Drink",
    reveal: "DELUSION. No, Italy did not secretly invent pickle coffee. This is pure culinary chaos.",
    color: "plum",
  },
  {
    id: 35,
    name: "Banana Biryani",
    description: "Fragrant basmati rice cooked with bananas, cardamom, chili, and fried onions.",
    answer: "fake",
    origin: "Pakistan",
    category: "Rice Dish",
    reveal: "DELUSION. Banana biryani sounds suspiciously believable because biryani has countless regional variations, but this particular dish was invented for the game.",
    color: "ocean",
  },
  {
    id: 36,
    name: "Masala Ice Cream Pizza",
    description: "A pizza base topped with vanilla ice cream, masala chai syrup, chili flakes, and crushed papad.",
    answer: "fake",
    origin: "Mumbai, India",
    category: "Dessert Pizza",
    reveal: "DELUSION. A truly terrible-sounding combination assembled from several real Indian flavors. No secret Mumbai specialty here.",
    color: "tomato",
  },
  {
    id: 37,
    name: "Garlic Cotton Candy",
    description: "Cotton candy flavored with roasted garlic and served alongside caramelized onions.",
    answer: "fake",
    origin: "France",
    category: "Dessert",
    reveal: "DELUSION. Garlic cotton candy is not a traditional French dessert. The concept exists only because someone clearly asked, \u201cHow far can we take this?\u201d",
    color: "mustard",
  },
  {
    id: 38,
    name: "Fried Water",
    description: "Water sealed inside a thin edible shell and deep-fried until crispy.",
    answer: "fake",
    origin: "Japan",
    category: "Snack",
    reveal: "DELUSION. Fried water is an internet-famous absurd concept, but it is not a traditional Japanese dish. Water and deep frying remain a particularly bad culinary partnership.",
    color: "sage",
  },
  {
    id: 39,
    name: "Strawberry Samosa Cake",
    description: "A triangular pastry filled with strawberries, sponge cake, and whipped cream, then dusted with chaat masala.",
    answer: "fake",
    origin: "Rajasthan, India",
    category: "Dessert",
    reveal: "DELUSION. Samosas and strawberry desserts are real. This particular combination is not a traditional Rajasthani dish.",
    color: "plum",
  },
  {
    id: 40,
    name: "Cheesecake Dal",
    description: "Yellow lentils cooked with cream cheese and biscuit crumbs, served in a miniature cake tin.",
    answer: "fake",
    origin: "Delhi, India",
    category: "Fusion",
    reveal: "DELUSION. Dal and cheesecake are both real. Their supposed union is not.",
    color: "ocean",
  },
  {
    id: 41,
    name: "Blueberry Naan Sundae",
    description: "A tandoor-baked naan topped with blueberry ice cream, honey, pistachios, and black pepper.",
    answer: "fake",
    origin: "Amritsar, India",
    category: "Dessert",
    reveal: "DELUSION. Naan desserts exist as modern fusion creations, but this fictional version was designed specifically to sound like something a trendy restaurant might sell.",
    color: "tomato",
  },
  {
    id: 42,
    name: "Coconut Butter Tea",
    description: "Hot tea blended with coconut butter, chili oil, and crushed almonds.",
    answer: "fake",
    origin: "Bhutan",
    category: "Drink",
    reveal: "DELUSION. Butter tea is real, and coconut drinks are real. This exact combination is fictional.",
    color: "mustard",
  },
  {
    id: 43,
    name: "Mango Mustard Cake",
    description: "A sponge cake layered with sweet mango puree and a sharp mustard cream.",
    answer: "fake",
    origin: "Kolkata, India",
    category: "Dessert",
    reveal: "DELUSION. Mango and mustard are both common ingredients in South Asian cooking, but this particular cake is made up.",
    color: "sage",
  },
  {
    id: 44,
    name: "Popcorn Soup",
    description: "Creamy corn soup topped with popcorn that supposedly dissolves into the broth as you eat it.",
    answer: "fake",
    origin: "United States",
    category: "Soup",
    reveal: "DELUSION. Popcorn soup sounds like a real novelty dish, but this exact preparation is fictional.",
    color: "plum",
  },
  {
    id: 45,
    name: "Chocolate Paneer Pie",
    description: "A sweet pie filled with paneer, dark chocolate, cardamom, and jaggery.",
    answer: "fake",
    origin: "Gujarat, India",
    category: "Dessert",
    reveal: "DELUSION. Paneer appears in plenty of Indian sweets, but this supposed Gujarati chocolate pie is invented.",
    color: "ocean",
  },
  {
    id: 46,
    name: "Watermelon Curry",
    description: "Watermelon cubes simmered in coconut milk, curry leaves, turmeric, and chili.",
    answer: "fake",
    origin: "Sri Lanka",
    category: "Curry",
    reveal: "DELUSION. Fruit curries absolutely exist, which makes this one sound believable. But this particular watermelon curry is fictional.",
    color: "tomato",
  },
  {
    id: 47,
    name: "Pizza Chai",
    description: "Masala chai infused with tomato, oregano, mozzarella foam, and a pinch of chili flakes.",
    answer: "fake",
    origin: "Mumbai, India",
    category: "Drink",
    reveal: "DELUSION. Chai and pizza are both popular. Combining them into one drink is entirely our problem.",
    color: "mustard",
  },
  {
    id: 48,
    name: "Caramel Samosa Soup",
    description: "Crispy samosa pastry floating in warm caramel sauce with cinnamon and vanilla.",
    answer: "fake",
    origin: "London, UK",
    category: "Dessert Soup",
    reveal: "DELUSION. This is not a traditional British dessert. It is a deliberately plausible fusion invention.",
    color: "sage",
  },
  {
    id: 49,
    name: "Mango Cheese Tea",
    description: "Iced mango tea topped with a thick layer of whipped cream cheese and black pepper.",
    answer: "fake",
    origin: "South Korea",
    category: "Drink",
    reveal: "DELUSION. Fruit teas and cheese-topped drinks exist in various modern beverage trends, but this exact dish was invented for the game.",
    color: "plum",
  },
  {
    id: 50,
    name: "Masala Cheesecake Dosa",
    description: "A crispy dosa filled with cheesecake, mango chutney, and crushed peanuts.",
    answer: "fake",
    origin: "Bengaluru, India",
    category: "Fusion",
    reveal: "DELUSION. Dosa fusion is real and cheesecake is real. This particular combination is fictional.",
    color: "ocean",
  },
  {
    id: 51,
    name: "Strawberry Sambar",
    description: "Traditional lentil sambar sweetened with fresh strawberries instead of tamarind.",
    answer: "fake",
    origin: "Tamil Nadu, India",
    category: "Curry",
    reveal: "DELUSION. Sambar has many regional variations, but strawberry sambar is not a traditional Tamil dish.",
    color: "tomato",
  },
  {
    id: 52,
    name: "Chocolate Idli Pudding",
    description: "Steamed idli batter mixed with cocoa, condensed milk, and chocolate chips, then served with vanilla sauce.",
    answer: "fake",
    origin: "Chennai, India",
    category: "Dessert",
    reveal: "DELUSION. Chocolate versions of Indian staples are easy to imagine, but this particular dessert was invented for the game.",
    color: "mustard",
  },
  {
    id: 53,
    name: "Peanut Butter Biryani",
    description: "Basmati rice cooked with peanut butter, saffron, cinnamon, and crispy fried onions.",
    answer: "fake",
    origin: "Hyderabad, India",
    category: "Rice Dish",
    reveal: "DELUSION. Hyderabad has an enormous biryani culture, but peanut butter biryani is not a traditional Hyderabadi dish.",
    color: "sage",
  },
  {
    id: 54,
    name: "Coffee Paratha",
    description: "Layered paratha dough filled with sweet coffee paste and served with whipped cream.",
    answer: "fake",
    origin: "Punjab, India",
    category: "Flatbread",
    reveal: "DELUSION. Parathas have countless fillings, including sweet ones, but coffee paratha is not a traditional Punjabi dish.",
    color: "plum",
  },
  {
    id: 55,
    name: "Garlic Jalebi",
    description: "Crispy jalebi spirals soaked in sugar syrup infused with roasted garlic and black pepper.",
    answer: "fake",
    origin: "Rajasthan, India",
    category: "Dessert",
    reveal: "DELUSION. Jalebi is very real. Garlic jalebi, however, is a fictional monstrosity.",
    color: "ocean",
  },
  {
    id: 56,
    name: "Cola Rasmalai",
    description: "Rasmalai soaked in chilled cola instead of sweetened milk and topped with peanuts.",
    answer: "fake",
    origin: "West Bengal, India",
    category: "Dessert",
    reveal: "DELUSION. Rasmalai is a classic Bengali dessert, but cola rasmalai is not a traditional preparation.",
    color: "tomato",
  },
  {
    id: 57,
    name: "Mango Macaroni Kheer",
    description: "Elbow macaroni cooked in sweetened milk with mango puree, cardamom, and pistachios.",
    answer: "fake",
    origin: "Delhi, India",
    category: "Dessert",
    reveal: "DELUSION. Indian milk puddings can contain noodles or vermicelli, which makes this sound plausible. But this exact macaroni version is fictional.",
    color: "mustard",
  },
  {
    id: 58,
    name: "Pizza Pani Puri",
    description: "Crispy pani puri shells filled with tomato sauce, mozzarella, olives, and oregano.",
    answer: "fake",
    origin: "Mumbai, India",
    category: "Street Food",
    reveal: "DELUSION. Fusion pani puri exists, but this particular pizza-filled version is invented for the game.",
    color: "sage",
  },
  {
    id: 59,
    name: "Coconut Butter Popcorn Curry",
    description: "Popcorn cooked in coconut milk, curry leaves, mustard seeds, and turmeric.",
    answer: "fake",
    origin: "Kerala, India",
    category: "Snack",
    reveal: "DELUSION. Kerala cuisine uses coconut and spices extensively, which makes this one sound surprisingly plausible. It is still fictional.",
    color: "plum",
  },
  {
    id: 60,
    name: "Chocolate Chole",
    description: "Chickpeas simmered in a dark chocolate gravy with cinnamon, chili, and jaggery.",
    answer: "fake",
    origin: "Delhi, India",
    category: "Savory Dish",
    reveal: "DELUSION. Chocolate and chili can absolutely work together, and chole has many variations. But chocolate chole is not a traditional Delhi specialty.",
    color: "ocean",
  },
];

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = result[i];
    const other = result[j];
    // Dense array + j <= i < length, so both always exist; guard keeps the
    // swap type-safe under noUncheckedIndexedAccess.
    if (current === undefined || other === undefined) continue;
    result[i] = other;
    result[j] = current;
  }
  return result;
}

/** Track which dishes have already been dealt in the current cycle.
 *
 * `usedIds` holds every dish played since the cycle began (not just the last
 * game), so a dish cannot reappear until the whole dataset has been served.
 * `cycle` increments each time the pool wraps, which lets the UI/tests tell
 * one full pass over the dataset from the next. */
export type UsedPool = {
  usedIds: number[];
  cycle: number;
};

/** A full cycle over whatever the dataset currently holds. */
export function freshPool(): UsedPool {
  return { usedIds: [], cycle: 0 };
}

/** How many complete `count`-sized games the current dataset supports.
 *
 * Derived from DISHES.length at call time — nothing here assumes 60 dishes. */
export function gamesPerCycle(count: number): number {
  if (count <= 0) return 0;
  return Math.floor(DISHES.length / count);
}

/** Take `count` dishes from `available` keeping the real/fake split balanced.
 *
 * Keeps the old hand-rolling rule (for 5 rounds: 3 of one answer and 2 of the
 * other), but picks the majority answer to match the remaining pool's own
 * composition instead of a bare coin flip. A coin flip each game lets the split
 * random-walk, which repeatedly left the tail of a cycle with e.g. 5 fakes in a
 * row; following the pool ratio keeps every hand near 3/2 and drains the two
 * answers evenly. The `>= 0.5` tie-break still flips randomly when the pool is
 * exactly even, so consecutive identical splits stay possible. */
function takeBalanced(available: Dish[], count: number): Dish[] {
  const wanted = Math.min(count, available.length);
  if (wanted <= 0) return [];
  const reals = shuffle(available.filter((dish) => dish.answer === "real"));
  const fakes = shuffle(available.filter((dish) => dish.answer === "fake"));
  // Real dishes this share of the pool, clamped to the 3/2 or 2/3 window.
  const realShare = Math.round((wanted * reals.length) / available.length);
  let realCount = Math.min(Math.max(realShare, Math.floor(wanted / 2)), Math.ceil(wanted / 2));
  if (reals.length === fakes.length) {
    realCount = Math.random() < 0.5 ? Math.ceil(wanted / 2) : Math.floor(wanted / 2);
  }
  realCount = Math.min(realCount, reals.length);
  let fakeCount = Math.min(wanted - realCount, fakes.length);
  // One answer ran dry: give the shortfall to the other so the hand is full.
  const shortfall = wanted - realCount - fakeCount;
  if (shortfall > 0) {
    const extraReals = reals.length - realCount;
    const takeReals = Math.min(shortfall, extraReals);
    realCount += takeReals;
    fakeCount += Math.min(shortfall - takeReals, fakes.length - fakeCount);
  }
  const hand = [...reals.slice(0, realCount), ...fakes.slice(0, fakeCount)];
  return shuffle(hand);
}

/** Deal the next game's hand from the dishes not yet used this cycle.
 *
 * Returns the hand plus the updated pool for the caller to persist. When the
 * unused remainder cannot fill a game, the leftover dishes are played first and
 * the pool resets, then the hand is topped up from the whole dataset — so a
 * game never contains the same dish twice even across the wrap.
 */
export function dealFromPool(count: number, pool: UsedPool): { hand: Dish[]; next: UsedPool } {
  if (count <= 0) return { hand: [], next: pool };

  const used = new Set(pool.usedIds);
  // Guard against a stale persisted list (dataset edited between sessions).
  let unused = DISHES.filter((dish) => !used.has(dish.id));

  if (unused.length < count) {
    // Pool exhausted: play the remainder, reset, then top up from everything.
    const leftover = takeBalanced(unused, unused.length);
    const inHand = new Set(leftover.map((dish) => dish.id));
    const rest = takeBalanced(DISHES.filter((dish) => !inHand.has(dish.id)), count - leftover.length);
    const hand = shuffle([...leftover, ...rest]);
    return {
      hand,
      next: { usedIds: hand.map((dish) => dish.id), cycle: pool.cycle + 1 },
    };
  }

  const hand = takeBalanced(unused, count);
  return {
    hand,
    next: { usedIds: [...pool.usedIds, ...hand.map((dish) => dish.id)], cycle: pool.cycle },
  };
}
