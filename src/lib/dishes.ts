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

export const DISHES: Dish[] = [
  {
    id: 1,
    name: "Hákarl",
    description: "Fermented Greenland shark, traditionally hung to dry before being served in small cubes.",
    answer: "real",
    origin: "Iceland",
    category: "Fermented seafood",
    reveal: "Hákarl is a famously pungent Icelandic specialty. The shark is cured and fermented for months, then air-dried, turning a survival food into a very acquired taste.",
    color: "ocean",
  },
  {
    id: 2,
    name: "Chocolate-Covered Pickles",
    description: "Crunchy dill pickles dipped in dark chocolate and finished with flaky sea salt.",
    answer: "fake",
    origin: "The internet, probably",
    category: "Snack fiction",
    reveal: "This one is a culinary mash-up invented for the game. The salty-sweet combination sounds just plausible enough to make you question every state-fair menu.",
    fakeExplanation: "We combined two foods that already argue about whether they belong on a snack board.",
    color: "tomato",
  },
  {
    id: 3,
    name: "Stargazy Pie",
    description: "A Cornish pie with sardine heads poking through the pastry, gazing dramatically at the stars.",
    answer: "real",
    origin: "Mousehole, Cornwall",
    category: "Savory pie",
    reveal: "Stargazy pie is a traditional Cornish dish tied to the Tom Bawcock festival. The fish heads are part of the design, with their juices running back into the pie as it bakes.",
    color: "mustard",
  },
  {
    id: 4,
    name: "Cinnamon Tuna Toast",
    description: "Warm sourdough spread with tuna salad, cinnamon butter, and a drizzle of maple syrup.",
    answer: "fake",
    origin: "A very confused brunch",
    category: "Toast fiction",
    reveal: "Not a documented dish — just a dare written down with confidence. The sweet-savory idea is theoretically possible, but this exact combination is pure delusion.",
    fakeExplanation: "Someone asked what would happen if brunch stopped respecting its own boundaries. We took notes.",
    color: "plum",
  },
  {
    id: 5,
    name: "Tavuk Göğsü",
    description: "A silky milk pudding made with finely shredded chicken breast and dusted with cinnamon.",
    answer: "real",
    origin: "Türkiye",
    category: "Milk pudding",
    reveal: "Tavuk göğsü is a real Ottoman-era dessert. The chicken is boiled and shredded until its texture disappears into a chewy, milky pudding served cold.",
    color: "sage",
  },
  {
    id: 6,
    name: "Moon Cheese Soup",
    description: "A glowing blue cheese broth served with tiny edible silver stars floating on top.",
    answer: "fake",
    origin: "Somewhere past midnight",
    category: "Soup fiction",
    reveal: "This dish does not exist outside the game. We borrowed the drama of blue cheese and the visuals of a planetarium, then called it dinner.",
    fakeExplanation: "The silver stars were a clue. Nobody should have to wonder whether their soup is part of a constellation.",
    color: "ocean",
  },
  {
    id: 7,
    name: "Century Egg",
    description: "An egg preserved for weeks or months until the white turns dark and jelly-like.",
    answer: "real",
    origin: "China",
    category: "Preserved egg",
    reveal: "Century eggs are preserved with an alkaline curing mixture, not for an actual century. The yolk becomes creamy and the white takes on a translucent, amber-brown color.",
    color: "mustard",
  },
  {
    id: 8,
    name: "Banana Sushi with Ketchup",
    description: "A peeled banana rolled in rice, wrapped in nori, and served with a bright red dipping sauce.",
    answer: "fake",
    origin: "A fictional food court",
    category: "Sushi fiction",
    reveal: "A banana can absolutely be wrapped in seaweed, but this exact menu item was made up. Ketchup was added to make the decision feel personally insulting.",
    fakeExplanation: "It is technically roll-shaped, which is where the evidence ends.",
    color: "tomato",
  },
  {
    id: 9,
    name: "Balut",
    description: "A fertilized duck egg, incubated and boiled, then eaten from the shell with salt or vinegar.",
    answer: "real",
    origin: "The Philippines",
    category: "Street food",
    reveal: "Balut is a well-known Filipino street food and a cultural favorite. It is typically enjoyed with salt, vinegar, or a spicy sauce, often as a late-day snack.",
    color: "plum",
  },
  {
    id: 10,
    name: "Lavender Meatball Cake",
    description: "A three-layer celebration cake made from baked meatballs, lavender frosting, and candied onions.",
    answer: "fake",
    origin: "A birthday nobody requested",
    category: "Cake fiction",
    reveal: "This is an invented celebration food. The game kitchen wanted to know how far the cake format could be pushed before the candles felt like a warning.",
    fakeExplanation: "We made it up because even savory cakes deserve a villain origin story.",
    color: "sage",
  },
];

export function shuffleDishes(dishes: Dish[]) {
  return [...dishes].sort(() => Math.random() - 0.5);
}