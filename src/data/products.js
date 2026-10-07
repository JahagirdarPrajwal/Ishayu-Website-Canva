/* ==================================================================
   Product Page catalogue â€” names, categories and descriptions
   transcribed from "2.png" (the Product Page reference export), in the
   same order the reference lists them. Images are the supplied
   product-shoot assets, mapped by filename (CLAUDE.md product-page brief
   Â§4) â€” see public/assets/products/shoot/.

   Prices are the client-supplied Product Catalog (modal-refinement brief
   Â§17) â€” INR only, "Rs. NN", no $ anywhere on the page.
================================================================== */

export const CATEGORIES = [
  { label: 'ALL', count: 18 },
  { label: 'ENERGY BARS', count: 5 },
  { label: 'COATZ', count: 4 },
  { label: 'NUTRIBITES', count: 7 },
  { label: 'SPRINKLES', count: 2 },
]

export const PRODUCTS = [
  {
    key: 'moringa-energy',
    category: 'ENERGY BAR',
    name: 'MORINGA ENERGY',
    description: 'PEANUT BUTTER, PEANUTS, CASHEWS, ALMONDS, MORINGA',
    price: 'Rs. 95',
    image: '/assets/products/shoot/moringa-energy.png',
  },
  {
    key: 'beet-energy',
    category: 'ENERGY BAR',
    name: 'BEET ENERGY',
    description: 'BEETROOT, PEANUTS, ALMONDS, CASHEWS, PEANUT BUTTER',
    price: 'Rs. 90',
    image: '/assets/products/shoot/beet-energy.png',
  },
  {
    key: 'peanut-butter-energy',
    category: 'ENERGY BAR',
    name: 'PEANUT BUTTER ENERGY',
    description: 'PEANUT BUTTER, CASHEWS, OATS, ROASTED PEANUTS, ALMONDS',
    price: 'Rs. 85',
    image: '/assets/products/shoot/peanut-butter-energy.png',
  },
  {
    key: 'cocoa-energy',
    category: 'ENERGY BAR',
    name: 'COCOA ENERGY',
    description: 'WHEY PROTEIN, SPROUTED RAGI, PEANUTS, CASHEWS, COCOA',
    price: 'Rs. 90',
    image: '/assets/products/shoot/cocoa-energy.png',
  },
  {
    key: 'ragi-millet',
    category: 'ENERGY BAR',
    name: 'RAGI MILLET',
    description: 'SPROUTED RAGI, PEANUTS, CASHEWS, ALMONDS, PUFFED RAGI',
    price: 'Rs. 80',
    image: '/assets/products/shoot/ragi-millet.png',
  },
  {
    key: 'coatz-chilli-garlic-almonds',
    category: 'COATZ',
    name: 'CHILLI GARLIC ALMONDS',
    description: 'ALMONDS, CHILLI, GARLIC, HERBS, SPICES',
    price: 'Rs. 50',
    image: '/assets/products/shoot/coatz-chilli-garlic-almonds.png',
  },
  {
    key: 'coatz-chilli-garlic-cashews',
    category: 'COATZ',
    name: 'CHILLI GARLIC CASHEWS',
    description: 'CASHEWS, CHILLI, GARLIC, HERBS, SPICES',
    price: 'Rs. 55',
    image: '/assets/products/shoot/coatz-chilli-garlic-cashews.png',
  },
  {
    key: 'coatz-tangy-spiced-almonds',
    category: 'COATZ',
    name: 'TANGY SPICED ALMONDS',
    description: 'ALMONDS, TANGY SPICES, HERBS, CHILLI, SEASONING',
    price: 'Rs. 50',
    image: '/assets/products/shoot/coatz-tangy-spiced-almonds.png',
  },
  {
    key: 'coatz-tangy-spiced-cashews',
    category: 'COATZ',
    name: 'TANGY SPICED CASHEWS',
    description: 'CASHEWS, TANGY SPICES, HERBS, CHILLI, SEASONING',
    price: 'Rs. 55',
    image: '/assets/products/shoot/coatz-tangy-spiced-cashews.png',
  },
  {
    key: 'nutribite-flaxseed',
    category: 'NUTRI BITE',
    name: 'FLAXSEED',
    description: 'FLAXSEED, PEANUTS, JAGGERY, NUTS, SPICES',
    price: 'Rs. 45',
    image: '/assets/products/shoot/nutribite-flaxseed.png',
  },
  {
    key: 'nutribite-turmeric',
    category: 'NUTRI BITE',
    name: 'TURMERIC',
    description: 'TURMERIC, PEANUTS, JAGGERY, NUTS, SPICES',
    price: 'Rs. 45',
    image: '/assets/products/shoot/nutribite-turmeric.png',
  },
  {
    key: 'nutribite-moringa',
    category: 'NUTRI BITE',
    name: 'MORINGA',
    description: 'MORINGA LEAVES, PEANUT, JAGGERY, PEPPER, CARDAMOM',
    price: 'Rs. 45',
    image: '/assets/products/shoot/nutribite-moringa.png',
  },
  {
    key: 'nutribite-ginger',
    category: 'NUTRI BITE',
    name: 'GINGER',
    description: 'GINGER, PEANUT, JAGGERY, PEPPER, CARDAMOM',
    price: 'Rs. 45',
    image: '/assets/products/shoot/nutribite-ginger.png',
  },
  {
    key: 'nutribite-coffee',
    category: 'NUTRI BITE',
    name: 'COFFEE',
    description: 'PEANUT, JAGGERY, COFFEE BEAN, GINGER',
    price: 'Rs. 45',
    image: '/assets/products/shoot/nutribite-coffee.png',
  },
  {
    key: 'nutribite-beet',
    category: 'NUTRI BITE',
    name: 'BEET',
    description: 'BEETROOT, PEANUT, JAGGERY, PEPPER, CARDAMOM',
    price: 'Rs. 45',
    image: '/assets/products/shoot/nutribite-beet.png',
  },
  {
    key: 'nutribite-coconut',
    category: 'NUTRI BITE',
    name: 'COCONUT',
    description: 'COCONUT, PEANUT, JAGGERY, PEPPER, CARDAMOM',
    price: 'Rs. 45',
    image: '/assets/products/shoot/nutribite-coconut.png',
  },
  {
    key: 'sprinkle-sweet-blend',
    category: 'SPRINKLE',
    name: 'SWEET BLEND',
    description: 'BEETROOT, CARROT, METHI LEAVES & GINGER POWDER',
    price: 'Rs. 90',
    image: '/assets/products/shoot/sprinkle-sweet-blend.png',
  },
  {
    key: 'sprinkle-spice-blend',
    category: 'SPRINKLE',
    name: 'SPICE BLEND',
    description: 'CUMIN, RED CHILLI, AJWAIN & CURRY LEAVES POWDER',
    price: 'Rs. 90',
    image: '/assets/products/shoot/sprinkle-spice-blend.png',
  },
]
