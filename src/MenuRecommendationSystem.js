import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
  Loader, ShoppingCart, Mic, Send, X, Plus, Minus, Sparkles,
  Coffee, Pizza, Cake, Menu, Search, Star, ChevronDown, ChevronUp,
  ArrowRight, ArrowLeft, Trash2, AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./components/ui/alert-dialog";

import WelcomeScreen from './WelcomeScreen';

const ClearChatButton = ({ onClearChat, theme, isVisible }) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleClearChat = () => {
    onClearChat();
    setIsDialogOpen(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDialogOpen(true)}
            className={`p-2 rounded-full shadow-md transition-colors ${
              theme === 'light'
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
            aria-label="Clear chat"
          >
            <Trash2 size={20} />
          </motion.button>

          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogContent className={theme === 'light' ? 'bg-white' : 'bg-gray-800'}>
              <AlertDialogHeader>
                <AlertDialogTitle className={`flex items-center space-x-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  <AlertCircle className="text-red-500" size={24} />
                  <span>Clear Chat History</span>
                </AlertDialogTitle>
                <AlertDialogDescription className={theme === 'light' ? 'text-gray-500' : 'text-gray-300'}>
                  Are you sure you want to clear all chat history? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className={`${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-700 text-white'} hover:opacity-80`}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearChat}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Clear Chat
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


const MenuRecommendationSystem = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [cart, setCart] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [suggestivePrompts, setSuggestivePrompts] = useState([
    { icon: Coffee, text: "Craft a perfect breakfast" },
    { icon: Pizza, text: "Discover our spiciest dish" },
    { icon: Cake, text: "Surprise me with a culinary delight" },
  ]);
  const [isPromptsExpanded, setIsPromptsExpanded] = useState(true);
  const searchInputRef = useRef(null);
  const conversationEndRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [favorites, setFavorites] = useState([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const storyRef = useRef(null);
  const storyContentRef = useRef(null);
  const [chatId, setChatId] = useState(null);

  const clearChat = () => {
    setConversations([]);
    setChatId(null);
    // You might want to add any other state resets here
  };
  const isChatStarted = conversations.length > 0;
  const storyControls = useAnimation();

  const [showWelcome, setShowWelcome] = useState(true);
  // ... (other state variables remain the same)

  const handleGetStarted = () => {
    setShowWelcome(false);
  };

  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      if (st > lastScrollTop.current && st > 50) {
        // Scrolling down and past the threshold
        setIsHeaderVisible(false);
      } else if (st < lastScrollTop.current || st <= 50) {
        // Scrolling up or at the top
        setIsHeaderVisible(true);
      }
      lastScrollTop.current = st <= 0 ? 0 : st;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const [menuItems, setMenuItems] = useState([
    ,
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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);


  


  const openStory = (index) => {
    setActiveStoryIndex(index);
    setIsStoryOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeStory = () => {
    setIsStoryOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextStory = () => {
    if (activeStoryIndex < conversations.length - 1) {
      setActiveStoryIndex(prevIndex => prevIndex + 1);
      storyControls.start({ opacity: [0, 1], x: [50, 0] });
    } else {
      closeStory();
    }
  };

  const prevStory = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(prevIndex => prevIndex - 1);
      storyControls.start({ opacity: [0, 1], x: [-50, 0] });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isStoryOpen) {
        if (e.key === 'ArrowRight') nextStory();
        else if (e.key === 'ArrowLeft') prevStory();
        else if (e.key === 'Escape') closeStory();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStoryOpen, activeStoryIndex]);

  useEffect(() => {
    if (isStoryOpen && storyContentRef.current) {
      storyContentRef.current.scrollTop = 0;
    }
  }, [activeStoryIndex, isStoryOpen]);

  const StoryContent = ({ conversation }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="h-full overflow-y-auto px-4 py-8"
      ref={storyContentRef}
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-white">{conversation.query}</h2>
        <ReactMarkdown
          components={{
            p: ({ node, ...props }) => <p className="mb-4 text-gray-200" {...props} />,
            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4 text-white" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-3 text-white" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-xl font-bold mb-2 text-white" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 text-gray-200" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 text-gray-200" {...props} />,
            li: ({ node, ...props }) => <li className="mb-2 text-gray-200" {...props} />,
            code: ({ node, inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={tomorrow}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-md overflow-hidden my-4"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-gray-800 rounded px-1 py-0.5 text-gray-200" {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {conversation.response}
        </ReactMarkdown>
        {conversation.items.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 text-white">Recommended Items</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {conversation.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                >
                  <img src={item.image_link} alt={item.name_of_item} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h4 className="text-lg font-semibold mb-2 text-white">{item.name_of_item}</h4>
                    <p className="text-sm text-gray-300 mb-4">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-blue-400">₹{item.cost.toFixed(2)}</span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(item)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors"
                      >
                        Add to Cart
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );






  const handleSearch = useCallback(async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
  
    setIsLoading(true);
    const newConversation = { query, response: 'Waiting for response...', items: [] };
    setConversations(prev => [...prev, newConversation]);
  
    const pollInterval = 10000; // 10 seconds
    const maxAttempts = 24; // 4 minutes total (24 * 10 seconds)
    let attempts = 0;
  
    const pollForResponse = async () => {
      try {
        let url = `https://menubot-backend.onrender.com/chat/?query=${encodeURIComponent(query)}`;
        if (chatId) {
          url += `&chat_id=${chatId}`;
        }
  
        const response = await fetch(url);
        const data = await response.json();
  
        if (!chatId && data.chat_id) {
          setChatId(data.chat_id);
        }
  
        if (data.status === 'processing') {
          attempts++;
          if (attempts >= maxAttempts) {
            throw new Error('Max attempts reached');
          }
          setConversations(prev => 
            prev.map((conv, index) => 
              index === prev.length - 1 
                ? { ...conv, response: `Still processing... (${attempts * 10} seconds)` }
                : conv
            )
          );
          setTimeout(pollForResponse, pollInterval);
        } else {
          setConversations(prev => 
            prev.map((conv, index) => 
              index === prev.length - 1 
                ? { ...conv, response: data.response_text, items: data.returned_items || [] }
                : conv
            )
          );
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setConversations(prev => 
          prev.map((conv, index) => 
            index === prev.length - 1 
              ? { ...conv, response: 'An error occurred while fetching the data. Please try again.' }
              : conv
          )
        );
        setIsLoading(false);
      }
    };
  
    pollForResponse();
  
    setQuery('');
    setIsPromptsExpanded(false);
  }, [query, chatId]);



  

  const handleSuggestivePrompt = useCallback((promptText) => {
    setQuery(promptText);
    handleSearch({ preventDefault: () => {} });
  }, [handleSearch]);

  const toggleTheme = () => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');

  const toggleFavorite = useCallback((item) => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.some(fav => fav.name_of_item === item.name_of_item);
      if (isFavorite) {
        return prevFavorites.filter(fav => fav.name_of_item !== item.name_of_item);
      } else {
        return [...prevFavorites, item];
      }
    });
  }, []);

  const addToCart = useCallback((item) => {
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
  }, []);

  const removeFromCart = useCallback((item) => {
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
  }, []);

  const handleVoiceInput = useCallback(() => {
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
  }, []);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations]);

  useEffect(() => {
    setFilteredMenuItems(
      menuItems.filter(item =>
        item.name_of_item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, menuItems]);

  const ConversationBubble = ({ isUser, content }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`max-w-3/4 p-4 rounded-lg shadow-md ${
        isUser 
          ? 'bg-blue-500 text-white self-end' 
          : `${theme === 'light' ? 'bg-white' : 'bg-gray-800'} ${theme === 'light' ? 'text-gray-800' : 'text-white'} self-start`
      }`}
    >
      <p className="whitespace-pre-wrap">{content}</p>
    </motion.div>
  );

  const ItemCard = ({ item }) => {
    const isFavorite = favorites.some(fav => fav.name_of_item === item.name_of_item);

    return (
      <motion.div 
        className={`rounded-lg shadow-lg overflow-hidden flex flex-col w-full h-96 cursor-pointer transform transition-all duration-300 hover:scale-105 ${
          theme === 'light' ? 'bg-white' : 'bg-gray-800'
        }`}
        onClick={() => setSelectedItem(item)}
        whileHover={{ y: -5 }}
      >
        <div className="h-48 overflow-hidden relative">
          <img src={item.image_link} alt={item.name_of_item} className="w-full h-full object-cover" />
          <motion.button 
            onClick={(e) => { e.stopPropagation(); toggleFavorite(item); }}
            className={`absolute top-2 right-2 p-2 rounded-full ${
              isFavorite ? 'bg-yellow-400' : 'bg-white bg-opacity-70'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Star size={16} className={isFavorite ? 'text-white' : 'text-gray-600'} />
          </motion.button>
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <h3 className={`font-bold text-lg mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{item.name_of_item}</h3>
            <p className={`text-sm line-clamp-3 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>{item.description}</p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-2xl font-bold text-blue-500">₹{item.cost.toFixed(2)}</p>
            <motion.button 
              onClick={(e) => { e.stopPropagation(); addToCart(item); }}
              className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add to Cart
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  const ItemModal = ({ item, isOpen, onClose }) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-[90%] sm:max-w-[425px] mx-auto px-4 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
        <DialogHeader>
          <DialogTitle className={theme === 'light' ? 'text-gray-800' : 'text-white'}>{item.name_of_item}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <img
            src={item.image_link}
            alt={item.name_of_item}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <p className={`mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{item.description}</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-blue-600">
              ₹{item.cost.toFixed(2)}
            </p>
            <motion.button
              onClick={() => {
                addToCart(item);
                onClose();
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add to Cart
            </motion.button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const MenuItemCard = ({ item }) => (
    <motion.div 
      className={`rounded-lg shadow-md p-4 flex flex-col h-full ${
        theme === 'light' ? 'bg-white' : 'bg-gray-800'
      }`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <img src={item.image_link} alt={item.name_of_item} className="w-full h-40 object-cover rounded-lg mb-4" />
      <h3 className={`text-lg font-semibold mb-2 ${theme === 'light' ? 'text-gray-800' :'text-white'}`}>{item.name_of_item}</h3>
      <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} mb-2 flex-grow`}>
        {item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description}
      </p>
      <div className="flex justify-between items-center mt-auto">
        <p className="text-xl font-bold text-blue-600">₹{item.cost.toFixed(2)}</p>
        <motion.button
          onClick={() => addToCart(item)}
          className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );

  const PromptButton = ({ icon: Icon, text }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => handleSuggestivePrompt(text)}
      className={`px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300 flex items-center space-x-2 group text-sm ${
        theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-800 text-white'
      }`}
    >
      <Icon size={16} className="group-hover:animate-bounce text-blue-500" />
      <span className="truncate">{text}</span>
    </motion.button>
  );

  const NavButton = ({ icon: Icon, text, onClick, isActive, isAnimated = false, badge = null }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-300 w-20 relative ${
        isActive
          ? theme === 'light'
            ? 'text-blue-600'
            : 'text-blue-400'
          : theme === 'light'
          ? 'text-gray-600 hover:text-gray-800'
          : 'text-gray-400 hover:text-white'
      }`}
    >
      <div className="relative">
        <Icon size={24} />
        {badge !== null && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
          >
            {badge}
          </motion.div>
        )}
      </div>
      <div className="h-4 flex items-center justify-center">
        {isAnimated ? (
          <AnimatePresence mode="wait">
            <motion.span
              key={text}
              className="text-xs font-medium"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {text}
            </motion.span>
          </AnimatePresence>
        ) : (
          <span className="text-xs font-medium">{text}</span>
        )}
      </div>
    </motion.button>
  );

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className={`min-h-screen flex flex-col ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-gray-100 to-gray-200' 
        : 'bg-gradient-to-br from-gray-900 to-gray-800'
    }`}>
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 p-4 shadow-md ${
          theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-900 text-white'
        }`}
        initial={{ y: 0 }}
        animate={{ y: isHeaderVisible ? 0 : '-100%' }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            RestoChat
          </h1>
          <div className="flex items-center space-x-4">
            <ClearChatButton onClearChat={clearChat} theme={theme} isVisible={isChatStarted} />
            <motion.button 
              onClick={toggleTheme} 
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </motion.button>
          </div>
        </div>
      </motion.header>

      <main className="flex-grow p-4 overflow-auto pb-32 mt-16">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence>
            {conversations.map((conv, index) => (
              <motion.div 
                key={index} 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className={`p-6 rounded-lg shadow-lg cursor-pointer ${
                    theme === 'light' ? 'bg-white hover:bg-gray-50' : 'bg-gray-800 hover:bg-gray-700'
                  } transition-colors duration-200`}
                  onClick={() => openStory(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h3 className={`text-lg font-semibold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    {conv.query}
                  </h3>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                    {conv.response.substring(0, 100)}...
                  </p>
                  {conv.items.length > 0 && (
                    <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
                      {conv.items.slice(0, 3).map((item, itemIndex) => (
                        <img
                          key={itemIndex}
                          src={item.image_link}
                          alt={item.name_of_item}
                          className="w-16 h-16 object-cover rounded-full border-2 border-blue-500"
                        />
                      ))}
                      {conv.items.length > 3 && (
                        <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                          +{conv.items.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={conversationEndRef} />
        </div>
      </main>

      <footer className={`fixed bottom-0 left-0 right-0 transition-all duration-300 ease-in-out ${
        theme === 'light' ? 'bg-white bg-opacity-80' : 'bg-gray-900 bg-opacity-80'
      } backdrop-blur-md`}>
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          <motion.div
            initial={false}
            animate={{ height: isPromptsExpanded ? 'auto' : '0' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <AnimatePresence>
                {suggestivePrompts.map((prompt, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <PromptButton icon={prompt.icon} text={prompt.text} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              ref={searchInputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you craving today?"
              className={`w-full p-4 pr-24 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-base ${
                theme === 'light' 
                  ? 'bg-gray-100 text-gray-800 placeholder-gray-500' 
                  : 'bg-gray-800 text-white placeholder-gray-400'
              }`}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={handleVoiceInput}
                className={`p-2 rounded-full ${
                  isListening 
                    ? 'bg-red-500 text-white' 
                    : theme === 'light' ? 'bg-gray-200 text-gray-600' : 'bg-gray-700 text-gray-300'
                } hover:bg-opacity-80 transition-colors`}
              >
                <Mic size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Send size={20} />
              </motion.button>
            </div>
          </form>
          <nav className="flex justify-around items-center py-2  border-gray-200 dark:border-gray-700">
            <NavButton icon={Menu} text="Menu" onClick={toggleMenu} isActive={isMenuOpen} />
            <NavButton
              icon={isPromptsExpanded ? ChevronDown : ChevronUp}
              text={isPromptsExpanded ? "Hide" : "Inspire"}
              onClick={() => setIsPromptsExpanded(!isPromptsExpanded)}
              isActive={isPromptsExpanded}
              isAnimated={true}
            />
            <NavButton 
              icon={ShoppingCart} 
              text="Cart" 
              onClick={toggleCart} 
              isActive={isCartOpen}
              badge={cartItemCount > 0 ? cartItemCount : null}
            />
          </nav>
        </div>
      </footer>

      <AnimatePresence>
        {isStoryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            onClick={closeStory}
          >
            <motion.div
              className="w-full h-full max-w-4xl mx-auto relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              ref={storyRef}
            >
              <motion.div
                className="absolute inset-0"
                animate={storyControls}
                initial={{ opacity: 1, x: 0 }}
              >
                <StoryContent conversation={conversations[activeStoryIndex]} />
              </motion.div>
              <button
                className="absolute top-4 right-4 text-white"
                onClick={closeStory}
              >
                <X size={24} />
              </button>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {conversations.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === activeStoryIndex ? 'bg-blue-500' : 'bg-gray-500'
                    }`}
                  />
                ))}
              </div>
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white"
                onClick={prevStory}
              >
                <ArrowLeft size={24} />
              </button>
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
                onClick={nextStory}
              >
                <ArrowRight size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
          >
            <motion.div 
              className={`absolute bottom-0 left-0 right-0 rounded-t-3xl ${
                theme === 'light' ? 'bg-white' : 'bg-gray-900'
              }`}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 h-[80vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Culinary Delights</h2>
                  <motion.button
                    onClick={toggleMenu}
                    className={`${theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-gray-300 hover:text-white'}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={24} />
                  </motion.button>
                </div>
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search our delicacies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full p-2 pl-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'light' 
                        ? 'bg-white border-gray-300 text-gray-800' 
                        : 'bg-gray-800 border-gray-700 text-white'
                    }`}
                  />
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                  }`} size={20} />
                </div>
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {filteredMenuItems.map((item) => (
                    <MenuItemCard key={item.name_of_item} item={item} />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
          >
            <motion.div 
              className={`absolute bottom-0 left-0 right-0 rounded-t-3xl ${
                theme === 'light' ? 'bg-white' : 'bg-gray-900'
              }`}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 h-[80vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Your Culinary Selection</h2>
                  <motion.button
                    onClick={toggleCart}
                    className={`${theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-gray-300 hover:text-white'}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={24} />
                  </motion.button>
                </div>
                {cart.length === 0 ? (
                  <motion.div 
                    className={`text-center py-8 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    Your culinary journey awaits! Add some delectable items to begin.
                  </motion.div>
                ) : (
                  <>
                    {cart.map((item, index) => (
                      <motion.div 
                        key={index} 
                        className={`flex items-center justify-between mb-4 p-4 rounded-lg ${
                          theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div>
                          <h3 className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{item.name_of_item}</h3>
                          <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>₹{item.cost} x {item.quantity}</p>
                        </div>
                        <div className="flex items-center">
                          <motion.button 
                            onClick={() => removeFromCart(item)} 
                            className={`text-red-500 hover:text-red-700 mr-2 p-1 rounded-full ${
                              theme === 'light' ? 'bg-white' : 'bg-gray-700'
                            } shadow-sm`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Minus size={16} />
                          </motion.button>
                          <span className={`mx-2 font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{item.quantity}</span>
                          <motion.button 
                            onClick={() => addToCart(item)} 
                            className={`text-green-500 hover:text-green-700 ml-2 p-1 rounded-full ${
                              theme === 'light' ? 'bg-white' : 'bg-gray-700'
                            } shadow-sm`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Plus size={16} />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                    <div className={`mt-4 pt-4 border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
                      <p className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                        Total: ₹{cart.reduce((total, item) => total + item.cost * item.quantity, 0).toFixed(2)}
                      </p>
                      <motion.button 
                        className="w-full mt-4 bg-blue-500 text-white py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Proceed to Checkout
                      </motion.button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedItem && (
        <ItemModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          theme={theme}
          addToCart={addToCart}
        />
      )}

      {isLoading && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Loader size={48} className="text-white animate-spin" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MenuRecommendationSystem;