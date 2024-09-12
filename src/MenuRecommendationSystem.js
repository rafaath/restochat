import React, { useState, useEffect, useRef } from 'react';
import { Loader, ShoppingCart, Mic, Send, X, Plus, Minus, Sparkles, Coffee, Pizza, Cake, Menu, Search} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import ReactMarkdown from 'react-markdown';

const MenuRecommendationSystem = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [cart, setCart] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [suggestivePrompts, setSuggestivePrompts] = useState([
    { icon: Coffee, text: "Recommend a perfect breakfast" },
    { icon: Pizza, text: "What's your spiciest dish?" },
    { icon: Cake, text: "Surprise me with a dessert!" },
    

    
  ]);
  const searchInputRef = useRef(null);
  const conversationEndRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([
    {
        "name_of_item": "High Protein - Soboro Don Low Gi Rice Bowl",
        "cost": 339.0,
        "description": "A classic japanese dish made of tangy and spicy minced chicken served over a bed of our healthy low gi rice topped with slices of perfectly boiled eggs. A dish where taste meets health. High protein and low gi balanced meal (gi value - 48) [Energy: 613.4 kcal, Protein: 38.1g, Carbohydrates: 54.5g, Fiber: 3.7g, Fat: 25.1g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/9/0cbbfa59-6f1e-4efe-8419-8604a1445eca_f56ce6d7-7216-4e45-91eb-3eaeec10432d.jpg"
    },
    {
        "name_of_item": "High Protein - Butter Chicken Low Gi Rice Bowl",
        "cost": 339.0,
        "description": "A delicious chicken gravy celebrating the goodness of desi butter, served alongside our special low gi rice. A dish where taste meets health. High protein and low gi balanced meal. Taste bhi. . . Health bhi. . . (gi value - 48) [Energy: 602 kcal, Protein: 29.9g, Carbohydrates: 58.4g, Fiber: 4.2g, Fat: 27.1g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/7/9e59321d-7b4d-48ba-9bd4-125743ed61d6_2b180860-a5db-4633-b603-eab5f872e684.jpg"
    },
    {
        "name_of_item": "High Protein - Schezwan Chilli Chicken Low Gi Rice Bowl",
        "cost": 339.0,
        "description": "A deliciously aromatic and flavourful schezwan chicken rice bowl prepared with our special low gi rice ,schezwan sauce and chicken. A dish where taste meets health. High protein and low gi balance meal (gi value - 48) [Energy: 513.6 kcal, Protein: 29.1g, Carbohydrates: 54.7g, Fiber: 3.4g, Fat: 18.2g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/9/6341123b-a1b3-4a93-be4d-d2d994fe3e22_380c620f-1e11-4938-8074-3a55753d2cdc.jpg"
    },
    {
        "name_of_item": "High Protein - Schezwan Chilli Paneer Exotic Veggies Low Gi Rice Bowl",
        "cost": 319.0,
        "description": "A deliciously aromatic and flavourful paneer rice bowl prepared with our special low gi rice,schezwan sauce along with exotic vegetables. A dish where taste meets health. High protein and low gi balanced meal. (gi value - 48) [Energy: 665.2 kcal, Protein: 25.6g, Carbohydrates: 58g, Fiber: 4g, Fat: 32.4g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/9/44ce79b1-9ec3-44cc-b336-87413920c421_97c2f817-0169-447a-8363-0b5503b04c36.jpg"
    },
    {
        "name_of_item": "High Protein - Egg Curry Masala Low Gi Rice Bowl",
        "cost": 299.0,
        "description": "A simple but flavourful egg curry masala made along with our special low gi rice. A dish where taste meets health. High protein and low gi balanced meal. (gi value - 48) [Energy: 577.5 kcal, Protein: 18.6g, Carbohydrates: 59.4g, Fiber: 4.2g, Fat: 29g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/9/f5f18a40-5e48-45c6-8875-83ac71c4a254_d667d1b1-6434-4a16-a5f4-ff0edc8a673c.jpg"
    },
    {
        "name_of_item": "High Protein - Paneer Makhani Low Gi Rice Bowl",
        "cost": 319.0,
        "description": "A delicious paneer makhani gravy celebrating the goodness of desi butter, served alongside our special low gi rice. A dish where taste meets health. High protein and low gi balanced meal. Taste bhi. . . Health bhi. . . (gi value - 48) [Energy: 758.6 kcal, Protein: 26.1g, Carbohydrates: 60.8g, Fiber: 4.2g, Fat: 42.6g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/9/9443d232-7828-4566-bff9-be3ea1004d8d_692f60af-eee7-4048-9301-1f86a7b24057.jpg"
    },
    {
        "name_of_item": "Paneer Kathi Roll - High Protein",
        "cost": 269.0,
        "description": "Protein 37. 1g - this protein rich scrumptious meal is perfected using soft paneer stir fried using delicious indian spices wrapped in a delicious layer prepared using lo!'s high protein atta. May contain soy, gluten, groundnuts and other nuts.  [Energy: 497.1 kcal, Protein: 37.1g, Carbohydrates: 33.8g, Fiber: 9g, Fat: 23.8g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/15/020d3b68-35ae-45b0-8e37-352b12401808_7e58b1b0-08ed-4d3b-9f8a-fc3bc3999936.jpg"
    },
    {
        "name_of_item": "Chicken Roll - High Protein",
        "cost": 299.0,
        "description": "Protein 42. 5g - a true ensemble of flavours powered with lo!'s high protein atta for an extravagant roll experience. Highquality, juicy chicken stir fried and flavoured using delicious indian spices, wrapped into healthfully delish layers makes a hearty high protein meal. May contain soy, gluten, groundnuts and other nuts.  [Energy: 440.9 kcal, Protein: 42.5g, Carbohydrates: 31.1g, Fiber: 8.6g, Fat: 16.5g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/15/e0ae1c3e-4916-45a2-b6cc-f3214bb18281_5491983f-33fb-423c-9984-83fa35e0538d.jpg"
    },
    {
        "name_of_item": "Egg Bhurji Roll - High Protein",
        "cost": 199.0,
        "description": "Protein 35. 2g - delicious egg bhurji filling wrapped in a high protein roll. Served to fulfil your taste buds as well as your diet preferences. May contain soy, gluten, groundnuts and other nuts.  [Energy: 545.9 kcal, Protein: 35.2g, Carbohydrates: 23.3g, Fiber: 5.8g, Fat: 35.1g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/15/bda051da-d380-4ebd-9581-b5e7b64f1817_e45b88a3-a5f0-4a21-9217-127390f86262.jpg"
    },
    {
        "name_of_item": "Mughlai Chicken Kathi Roll - High Protein",
        "cost": 289.0,
        "description": "Protein 40. 3g - high proteins have never been tastier! straight from the turco-mongol mughal empires to your plate, our special high protein mughalai chicken kathi roll ensures you get a burst of flavour in every juicy bite! made with our signature high-protein atta and tossed with the perfect balance of peppers and onions, this dish is just what you need! order this scrumptious roll today! [Energy: 425.2 kcal, Allergen: gluten,soy,peanut,nuts, Protein: 40.3g, Carbohydrates: 28.3g, Fiber: 7.3g, Fat: 18.1g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/15/30772f92-4199-4c49-9fe3-6148a92465f7_6f0efec8-155f-4bf5-8392-24aedb743626.jpg"
    },
    {
        "name_of_item": "Mughlai Paneer Kathi Roll - High Protein",
        "cost": 249.0,
        "description": "Protein 33. 4g - get blown away with this juicy and spicy delight! our high protein mughalai paneer kathi roll is all you can dream of and more! tossed in spicy mughalai marination, when this paneer meets peppers and onions, magic is made! this roll is wrapped in our special high-protein parathas to give you the perfect bite every time! order this succulent roll today! [Energy: 449.2 kcal, Allergen: soy,gluten,peanut,nuts, Protein: 33.4g, Carbohydrates: 27.9g, Fiber: 6.8g, Fat: 22.5g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/15/5046da0f-1cc0-4392-b24d-703ab94adf3a_7e8f1289-a8df-4c77-a089-cd24b041a1f2.jpg"
    },
    {
        "name_of_item": "Chicken Coleslaw Burger - 55g Protein Meal",
        "cost": 309.0,
        "description": "Protetin - 58g looking for a healthy yet delicious snack that packs a protein punch? then this high protein chicken coleslaw burger is the perfect choice for you! when juicy pieces of chicken and crunchy coleslaw come together with protein chef, it makes this a delicious way to satisfy your hunger while staying on track with your fitness goals. Served along with 40g high protein mixture [Energy: 670.9 kcal, Protein: 58.3g, Carbohydrates: 15.3g, Fat: 46.6g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/7b69fd917ffc7bc9e88bcd1547c52294"
    },
    {
        "name_of_item": "Chicken Roll - 55g Protein Chef Pro Meal",
        "cost": 349.0,
        "description": "Protein 58g - what came first, the chicken or the egg? the chicken of course because our chicken roll is winning hearts!  made with healthy ingredients and our signature protein chef pro protein powder to give you a super protein bump. Quit compromising on taste or health, get both in a pro package! go for the protein chef pro- chicken roll!. Served along with 40g high protein mixture   may contain soy, gluten, groundnuts and other nuts.  [Energy: 732.3 kcal, Protein: 59g, Carbohydrates: 43g, Fat: 36.3g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/hqqoustxrnxtyamprf51"
    },
    {
        "name_of_item": "Chicken Keema Pav (4 Buns) - 55g Protein Chef Pro Meal",
        "cost": 349.0,
        "description": "Protein 59g - spicy chicken kheema now with a double dose of proteins. Enjoy this delicacy paired with our signature high protein buns. Made with healthy ingredients and our signature protein chef pro protein powder to give you a super protein bump. Quit compromising on taste or health, get both in a pro package! go for the protein chef pro- chicken kheema pav (4 buns)!. Served along with 40g high protein mixture   may contain soy, gluten, groundnuts and other nuts.  [Energy: 860 kcal, Protein: 59g, Carbohydrates: 19.8g, Fat: 51g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/buhfkuumfejb9skitq9m"
    },
    {
        "name_of_item": "Paneer Bhurji Pav - 55g Protein Meal",
        "cost": 349.0,
        "description": "Protein 60g - grated fresh cottage cheese stir fried with delicious veggies and seasoned with yummy spices served with a keto friendly toasted pav with 4 pav buns. Makes a scrumptious meal ideal for anytime indulgence. Served along with 40g high protein mixture  may contain soy, gluten, groundnuts and other nuts. ",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/gokjf37mtojmv75pj8pp"
    },
    {
        "name_of_item": "Butter Chicken Masala & Rotis Meal - 55g Protein Chef Pro Meal",
        "cost": 349.0,
        "description": "Protein 59g - when we say butter you say chicken. Now that you’re craving butter chicken, may we interest you in our high protein butter chicken masala and rotis meal?  made with healthy ingredients and our signature protein chef pro protein powder to give you a super protein bump. Go for the protein chef pro- butter chicken masala and rotis meal!. Served along with 40g high protein mixture   may contain soy, gluten, groundnuts and other nuts.  [Energy: 818 kcal, Protein: 59g, Carbohydrates: 21.5g, Fat: 49g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/g2unqfqczmc2ctxzwokd"
    },
    {
        "name_of_item": "Paneer Butter Masala & Rotis Meal - 55g Protein Chef Pro Meal",
        "cost": 349.0,
        "description": "Protein 56g - savory, buttery paneer gravy paired with the perfect high-protein rotis. This combo was designed to win your heart!made with healthy ingredients and our signature protein chef pro protein powder to give you a super protein bump. Quit compromising on taste or health, get both in a pro package! go for the protein chef pro- paneer butter masala & rotis meal!. Served along with 40g high protein mixture  may contain soy, gluten, groundnuts and other nuts.  [Energy: 973 kcal, Protein: 56g, Carbohydrates: 23.8g, Fat: 65g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/ti2jwz6zuacslx8hmdex"
    },
    {
        "name_of_item": "Chicken Burger - 55g Protein Meal",
        "cost": 309.0,
        "description": "Protein - 59g packed with tender, juicy chicken and a blend of savoury spices, this burger will satisfy your hunger and protein needs. Topped with melted cheese and crisp veggies, this wholesome and delicious meal is powered by protein chef. It will keep you fueled and satisfied. Bite into heaven with our high protein chicken loaded burger!. Served along with 40g high protein mixture [Energy: 889.8 kcal, Protein: 60.4g, Carbohydrates: 34.8g, Fat: 57.1g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/d94114df476047613415ae2e074761b6"
    },
    {
        "name_of_item": "Chicken Keema & Roti Meal - 55g Protein Meal",
        "cost": 389.0,
        "description": "Protein - 57g health ka tasty dose coming your way- try our chicken keema & high protein roti meal! enjoy the lip-smacking fusion of chicken keema and protein-packed roti (3 pc), providing you with a satisfyingly delicious meal. May contain soy, gluten, groundnuts, and other nuts. Served along with 40g high protein mixture [Energy: 753.5 kcal, Protein: 58.8g, Carbohydrates: 35.7g, Fat: 42.1g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/dfa4e1770ac1bdb746ccd752c0379a54"
    },
    {
        "name_of_item": "Chicken Keema & Paratha Meal - 55g Protein Meal",
        "cost": 389.0,
        "description": "Protein - 57g indulge in a high-protein frenzy with our chicken keema & high protein paratha meal. Savory chicken keema paired with protein-rich paratha (2 pc) made with our in-house high-protein atta, this meal is a perfect combination of taste and health. May contain soy, gluten, groundnuts, and other nuts. Served along with 40g high protein mixture [Energy: 733.4 kcal, Protein: 56.6g, Carbohydrates: 33.7g, Fat: 41.7g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/d02e310fa5dd8b462df979d5b493cb2c"
    },
    {
        "name_of_item": "Chicken Sandwich - High Protein",
        "cost": 159.0,
        "description": "Protein 19. 2g per sandwich - a truly delectable classic comfort: lip smackingly delicious high protein chicken sandwich healthified using 80% higher protein quality and 3 times more fiber. Perfect for weight watchers, muscle building and those who love a hearty flavour sandwich but prefer a high protein option. May contain soy, gluten, groundnuts and other nuts.  [Energy: 333.4 kcal, Protein: 19.2g, Carbohydrates: 17.2g, Fiber: 4.2g, Fat: 18.7g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/15/b54057d2-fef4-4db1-bf5b-8f396683a43f_b432b7b3-aaf6-4165-92ae-e948108066cb.jpg"
    },
    {
        "name_of_item": "Grilled Cheese Sandwich - High Protein",
        "cost": 149.0,
        "description": "Protein 17. 8g per sandwich - happiness is guaranteed with this delicious high protein veg cheese sandwich healthified using lo!'s high protein superfood rich flour loaded. Anytime indulgence made guilt free with 3 times more protein and 2 times more fiber compared to the usual. May contain soy, gluten, groundnuts and other nuts.  [Energy: 341.4 kcal, Protein: 17.8g, Carbohydrates: 21.5g, Fiber: 7.25g, Fat: 20.4g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/15/ea17ff2e-90df-4c89-8300-da221029abb6_69871d27-af57-47cd-80c9-8900f4b012d7.jpg"
    },
    {
        "name_of_item": "Paneer Sandwich - High Protein",
        "cost": 149.0,
        "description": "Protein 18. 2g per sandwich - cottage cheese heaven: scrumptious high protein paneer sandwich healthified using premium paneer, handpicked veggies and lo!'s bestselling high protein flour. Approximately 1/3rd of your daily protein requirement is taken care of!  may contain soy, gluten, groundnuts and other nuts.  [Energy: 357 kcal, Protein: 18.2g, Carbohydrates: 17.7g, Fiber: 4.2g, Fat: 21.9g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/15/8e7ff720-f573-4a43-9d97-c9f331072816_be4693a3-fa28-42d0-b5cf-30da9c9fb74d.jpg"
    },
    {
        "name_of_item": "Coleslaw & Grilled Cottage Cheese Sandwich - High Protein",
        "cost": 149.0,
        "description": "Protein 17. 5g per sandwich - indulge in the extravagance of high protein coleslaw sandwich from lo!. With the crunchiness of cabbage, bell peppers and chopped cilantro with the richness of roasted paneer cubes, our sandwich is enough to give you the joy of sheer healthy indulgence. With the topping of mayo, lemon juice, and the base of jalapeno spread, we’ll leave you asking for more!  may contain soy, gluten, groundnuts and other nuts.  [Energy: 339.3 kcal, Protein: 17.5g, Carbohydrates: 17.8g, Fiber: 4.8g, Fat: 19.9g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/15/34e20fe9-f1fe-46de-b059-68fe79d18c86_817f5326-8cf4-4f04-b752-0cc9c34473dc.jpg"
    },
    {
        "name_of_item": "Jalapeno Sandwich - High Protein",
        "cost": 149.0,
        "description": "Protein 14g per sandwich - made with a filling of crunchy onions and colourful bell peppers and small cubes of zucchini, our sandwich is enough to meet your daily protein intake requirement. Layered with classic mayo sauces, and jalapeno sauce spread, this deadly combo is sure to satiate your daily hunger pangs. So, whenever hungry, go, grab a bite of this treat made using high protein bread. May contain soy, gluten, groundnuts and other nuts.  [Energy: 319.7 kcal, Protein: 15.55g, Carbohydrates: 23.75g, Fiber: 8.2g, Fat: 18.05g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/15/f69e414b-8ce9-4cb1-bac4-d30671aa3c39_8666d4a5-a2c9-428f-8dd3-c3eec18c4217.jpg"
    },
    {
        "name_of_item": "Chicken Omelette - High Protein",
        "cost": 219.0,
        "description": "Protein 22. 4g - now introducing our new keto friendly omelette specially reimagined for meat lovers. This keto friendly chicken omelette makes the most satisfying and scrumptious breakfast and is one of the healthiest omelettes ever! [Energy: 282 kcal, Protein: 22.4g, Carbohydrates: 1.6g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/10/3f27b664-6ed9-4cb9-b4c0-cfc4b3e2be4f_a50ddd05-800c-4b60-8353-9de9a0939ce5.jpg"
    },
    {
        "name_of_item": "Bread Omelette - High Protein",
        "cost": 169.0,
        "description": "Protein 23. 7g - humble and healthy breakfast recipe made with a fluffy and smooth omelette stuffed between 2 slices of our signature keto bread. May contain soy, gluten, groundnuts and other nuts.  [Energy: 313 kcal, Protein: 23.7g, Carbohydrates: 7.7g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/10/f540ae0c-527a-4d75-a434-587cfd8659c2_c5d972f0-3033-43c7-b695-2c5d13022219.jpg"
    },
    {
        "name_of_item": "Masala Omelette - High Protein",
        "cost": 149.0,
        "description": "Protein 10. 9g - for those who like their eggs nice, firm and keto friendly! good old desi masala omelette now reimagined with a keto friendly twist.  [Energy: 169 kcal, Protein: 10.9g, Carbohydrates: 2.6g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/jmeopye8tsmz1gehft5i"
    },
    {
        "name_of_item": "Scrambled Eggs And Breads - High Protein",
        "cost": 179.0,
        "description": "Protein 23. 8g - try our 'melt in your mouth' soft and creamy scrambled eggs served alongside 2 slices of our signature low carb keto friendly bread. May contain soy, gluten, groundnuts and other nuts.  [Energy: 459 kcal, Protein: 23.8g, Carbohydrates: 7.2g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/10/80d9fe2a-6078-4eac-8343-183623b89ba8_ef80bdbd-ea4f-4da8-8262-c5dad41939ec.jpg"
    },
    {
        "name_of_item": "Cheese Omelette - High Protein",
        "cost": 159.0,
        "description": "Protein 14. 9g - say cheese to our freshly prepared fluffy omelette to kickstart your day with good health and ketosis. Made using two eggs.  [Energy: 231 kcal, Protein: 14.9g, Carbohydrates: 2.9g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/10/6585d50f-579b-4b34-a5ea-34af57fc0fe0_0f0e5c8d-bb59-462e-a148-3bce5f60613b.jpg"
    },
    {
        "name_of_item": "Chicken And Veggies Salad Bowl",
        "cost": 319.0,
        "description": "The combination of fresh vegetables like onion, capsicum, broccoli, zucchini, and carrots sautéed in melted butter, paired with the juiciest roasted grilled chicken and a slice of high protein grilled bread is too good to miss out on! the perfect seasoning of rosemary, black pepper, oregano, and magic masala simply takes the taste of this high-protein, nutrient-rich bowl to another level! [Energy: 452.8 kcal, Protein: 31.6g, Carbohydrates: 27.7g, Fiber: 9.5g, Fat: 24.4g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/10/40674e49-01bf-46e0-9755-7f4ccc198ba3_5d4f334e-44e9-40c2-b678-023d8f150fdd.jpg"
    },
    {
        "name_of_item": "Grilled Paneer And Veggies Salad Bowl",
        "cost": 319.0,
        "description": "Hand-picked, excotic veggies such as onion, capsicum, broccoli, zucchini, and carrots tossed in butter with tender roasted grilled paneer, and a slice of perfectly grilled high protein bread this bowl is your go-to meal for balanced nutrition in every bite! the seasoning of fresh rosemary, black pepper, oregano, and magic masala is sure to leave you craving for more! [Energy: 594.9 kcal, Protein: 29.8g, Carbohydrates: 28.2g, Fiber: 9g, Fat: 38.3g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/10/63bdb5a3-8d44-4068-840a-e9d814e26918_ee7b3172-08b5-48cd-998a-cccdb33b1290.jpg"
    },
    {
        "name_of_item": "Egg And Veggies Salad Bowl",
        "cost": 279.0,
        "description": "Dig into our lip-smacking yet highly nutritious egg and veggies salad bowl! it’s a delicious symphony of exotic veggies like onion, capsicum, broccoli, zucchini, and carrots tossed in  butter, two boiled eggs, and a slice of grilled high protein bread. Expertly seasoned with rosemary, black pepper, oregano, and the tempting magic masala, this bowl is a perfect treat to the taste buds and your health! [Energy: 453.9 kcal, Protein: 23.8g, Carbohydrates: 27.3g, Fiber: 9g, Fat: 28.3g]",
        "image_link": "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/10/4e92fc7f-43f8-4fc1-9acd-d6c438224804_c8cd4e3b-8b1e-4a62-95b6-371ab7099a8f.jpg"
    }
]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    const newConversation = { query, response: '', items: [] };
    setConversations(prev => [...prev, newConversation]);

    try {
      const response = await fetch(`/chat/?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      setConversations(prev => 
        prev.map((conv, index) => 
          index === prev.length - 1 
            ? { ...conv, response: data.response_text, items: data.returned_items || [] }
            : conv
        )
      );
    } catch (error) {
      console.error('Error fetching data:', error);
      setConversations(prev => 
        prev.map((conv, index) => 
          index === prev.length - 1 
            ? { ...conv, response: 'An error occurred while fetching the data. Please try again.' }
            : conv
        )
      );
    } finally {
      setIsLoading(false);
      setQuery('');
    }
  };

  const handleSuggestivePrompt = (promptText) => {
    setQuery(promptText);
    handleSearch({ preventDefault: () => {} });
  };

  const PromptButton = ({ icon: Icon, text }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => handleSuggestivePrompt(text)}
      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 group text-sm sm:text-base"
    >
      <Icon size={16} className="group-hover:animate-bounce" />
      <span className="truncate">{text}</span>
    </motion.button>
  );

  const addToCart = (item) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.name_of_item === item.name_of_item);
      if (existingItem) {
        return prev.map(cartItem => 
          cartItem.name_of_item === item.name_of_item 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (item) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.name_of_item === item.name_of_item);
      if (existingItem.quantity > 1) {
        return prev.map(cartItem => 
          cartItem.name_of_item === item.name_of_item 
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      } else {
        return prev.filter(cartItem => cartItem.name_of_item !== item.name_of_item);
      }
    });
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
      };
      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations]);

  const ConversationBubble = ({ isUser, content }) => (
    <div
      className={`max-w-3/4 p-3 rounded-lg ${
        isUser ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-gray-800 self-start'
      }`}
    >
      <p className="whitespace-pre-wrap">{content}</p>
    </div>
  );



  const ItemCard = ({ item }) => (
    <div 
      className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col w-full h-96 cursor-pointer transform transition-all duration-300 hover:scale-105"
      onClick={() => setSelectedItem(item)}
    >
      <div className="h-48 overflow-hidden">
        <img src={item.image_link} alt={item.name_of_item} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">{item.name_of_item}</h3>
          <p className="text-gray-600 text-sm line-clamp-3">{item.description}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-2xl font-bold text-blue-600">₹{item.cost.toFixed(2)}</p>
          <button 
            onClick={(e) => { e.stopPropagation(); addToCart(item); }}
            className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  const ItemModal = ({ item, isOpen, onClose }) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white sm:max-w-[425px] w-full mx-auto px-4">
        <DialogHeader>
          <DialogTitle>{item.name_of_item}</DialogTitle>
        </DialogHeader>
        <div className=" mt-4">
          <img src={item.image_link} alt={item.name_of_item} className="w-full h-64 object-cover rounded-lg mb-4" />
          <p className="text-gray-700 mb-4">{item.description}</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-blue-600">₹{item.cost.toFixed(2)}</p>
            <button 
              onClick={() => { addToCart(item); onClose(); }}
              className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

//   const updatePrompts = (newPrompts) => {
//     setSuggestivePrompts(newPrompts);
//   };
  
//   // Later, you could call this function with new prompts
//   updatePrompts([
//     { icon: Coffee, text: "Show me healthy options" },
//     { icon: Coffee, text: "What's your chef's special today?" },
//     { icon: Coffee, text: "I need a quick meal" }
//   ]);


useEffect(() => {
    setFilteredMenuItems(
      menuItems.filter(item =>
        item.name_of_item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, menuItems]);

  const MenuItemCard = ({ item }) => (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col h-full">
      <img src={item.image_link} alt={item.name_of_item} className="w-full h-40 object-cover rounded-lg mb-4" />
      <h3 className="text-lg font-semibold mb-2">{item.name_of_item}</h3>
      <p className="text-sm text-gray-600 mb-2 flex-grow">{item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description}</p>
      <div className="flex justify-between items-center mt-auto">
        <p className="text-xl font-bold text-blue-600">₹{item.cost.toFixed(2)}</p>
        <button
          onClick={() => addToCart(item)}
          className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">RestoChat</h1>
      </header>

      <main className="flex-grow p-4 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {conversations.map((conv, index) => (
            <div key={index} className="space-y-4">
              <div className="bg-blue-100 p-4 rounded-lg shadow">
                <p className="font-semibold">You: {conv.query}</p>
              </div>
              {conv.response && (
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="font-semibold mb-2">AI:</p>
                  <ReactMarkdown className="prose">
                    {conv.response}
                  </ReactMarkdown>
                </div>
              )}
              {conv.items.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {conv.items.map((item, itemIndex) => (
                    <ItemCard key={itemIndex} item={item} />
                  ))}
                </div>
              )}
            </div>
          ))}
          <div ref={conversationEndRef} />
        </div>
      </main>

      <footer className={`bg-white p-6 shadow-lg rounded-t-3xl transition-all duration-300 ease-in-out ${isMenuOpen ? 'transform translate-y-[calc(100%-4rem)]' : ''}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-wrap justify-center gap-4">
            <AnimatePresence>
              {suggestivePrompts.map((prompt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ 
                    transform: `translateX(${index % 3 === 1 ? '20px' : index % 3 === 2 ? '-20px' : '0'})`,
                  }}
                >
                  <PromptButton icon={prompt.icon} text={prompt.text} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              ref={searchInputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What would you like to eat?"
              className="w-full p-4 pr-20 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-base sm:text-lg"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={handleVoiceInput}
                className={`p-2 rounded-full ${isListening ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'} hover:bg-gray-300 transition-colors`}
              >
                <Mic size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="submit"
                className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Send size={18} />
              </motion.button>
            </div>
          </form>
        </div>
      </footer>

      <div className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-3xl transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'h-[calc(100%-4rem)]' : 'h-0'}`}>
        <div className="p-6 h-full overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Full Menu</h2>
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {filteredMenuItems.map((item) => (
              <MenuItemCard key={item.name_of_item} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Full Menu Button */}
      <button
        onClick={toggleMenu}
        className="fixed bottom-8 left-8 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        <Menu size={24} />
      </button>

      {selectedItem && (
        <ItemModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}


      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg p-4 overflow-auto transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <h2 className="text-xl font-bold mb-4">Your Cart</h2>
        <button
          onClick={() => setIsCartOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        {cart.map((item, index) => (
          <div key={index} className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">{item.name_of_item}</h3>
              <p className="text-sm text-gray-600">₹{item.cost} x {item.quantity}</p>
            </div>
            <div className="flex items-center">
              <button onClick={() => removeFromCart(item)} className="text-red-500 hover:text-red-700 mr-2">
                <Minus size={16} />
              </button>
              <span className="mx-2">{item.quantity}</span>
              <button onClick={() => addToCart(item)} className="text-green-500 hover:text-green-700 ml-2">
                <Plus size={16} />
              </button>
            </div>
          </div>
        ))}
        <div className="mt-4 pt-4 border-t">
          <p className="text-xl font-bold">
            Total: ₹{cart.reduce((total, item) => total + item.cost * item.quantity, 0).toFixed(2)}
          </p>
        </div>
      </div>

      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        <ShoppingCart size={24} />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
            {cart.reduce((total, item) => total + item.quantity, 0)}
          </span>
        )}
      </button>


      

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Loader size={48} className="text-white animate-spin" />
        </div>
      )}
    </div>
  );
};

export default MenuRecommendationSystem;