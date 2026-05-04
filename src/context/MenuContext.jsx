import { createContext, useContext, useState } from 'react';

const MenuContext = createContext(null);

const DEFAULT_ITEMS = [
  { id:1,  name:'Signature Espresso',    category:'Hot Coffee',      price:180, emoji:'☕', description:'Our house espresso blend — dark roast with notes of dark chocolate and hazelnut. Bold, smooth, unforgettable.', tags:['Hot','Popular','Bestseller'], featured:true },
  { id:2,  name:'Caramel Cloud Latte',   category:'Hot Coffee',      price:260, emoji:'🍮', description:'Velvety steamed milk with two shots of espresso and our house caramel drizzle. A café classic.',             tags:['Hot','Sweet'],               featured:false },
  { id:3,  name:'Oat Milk Flat White',   category:'Hot Coffee',      price:280, emoji:'🥛', description:'Perfectly microfoamed oat milk over a ristretto shot. Creamy, nutty, and plant-based.',                      tags:['Hot','Vegan'],               featured:false },
  { id:4,  name:'Japanese Iced Coffee',  category:'Cold Coffee',     price:240, emoji:'🧊', description:'Brewed hot directly over ice — full flavour with none of the bitterness.',                                    tags:['Cold','Popular'],            featured:true },
  { id:5,  name:'Dalgona Whip',          category:'Cold Coffee',     price:290, emoji:'🫙', description:'Whipped coffee cloud atop cold milk. Creamy, fluffy, and deeply caffeinating.',                               tags:['Cold','Sweet'],              featured:false },
  { id:6,  name:'Cold Brew Tonic',       category:'Cold Coffee',     price:320, emoji:'🥤', description:'18-hour cold brew over tonic water with a slice of orange. Effervescent and refreshing.',                    tags:['Cold','Premium'],            featured:false },
  { id:7,  name:'Chamomile Honey',       category:'Tea & Infusions', price:160, emoji:'🌼', description:'Organic chamomile with raw forest honey and a sliver of ginger. Calming and aromatic.',                      tags:['Herbal','Caffeine-free'],    featured:false },
  { id:8,  name:'Masala Chai',           category:'Tea & Infusions', price:140, emoji:'🫖', description:'Traditional spiced chai — cardamom, cinnamon, clove and ginger — made with full-cream milk.',                tags:['Spiced','Popular'],          featured:false },
  { id:9,  name:'Butter Croissant',      category:'Bakery',          price:160, emoji:'🥐', description:'Flaky, buttery, and laminated in-house every morning. Best enjoyed warm.',                                    tags:['Baked','Fresh'],             featured:false },
  { id:10, name:'Blueberry Scone',       category:'Bakery',          price:180, emoji:'🫐', description:'Scottish-style scone loaded with wild blueberries and a crunchy sugar glaze.',                                tags:['Baked','Sweet'],             featured:false },
  { id:11, name:'Avocado Toast',         category:'Snacks',          price:320, emoji:'🥑', description:'Sourdough toast with smashed avocado, cherry tomatoes, chilli flakes, and a soft-poached egg.',              tags:['Savoury','Fresh'],           featured:true },
  { id:12, name:'Banana Nutella Smoothie',category:'Smoothies',      price:270, emoji:'🍌', description:'Thick blend of frozen banana, oat milk, Nutella and cocoa nibs.',                                             tags:['Cold','Sweet','Filling'],    featured:false },
];

export function MenuProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tdg_menu') || 'null') || DEFAULT_ITEMS; } catch { return DEFAULT_ITEMS; }
  });

  const saveItems = (updated) => { setItems(updated); localStorage.setItem('tdg_menu', JSON.stringify(updated)); };
  const addItem = (item) => { const newItem = { ...item, id: Date.now(), featured: false }; saveItems([...items, newItem]); };
  const deleteItem = (id) => saveItems(items.filter(i => i.id !== id));
  const categories = ['All', ...new Set(items.map(i => i.category))];

  return (
    <MenuContext.Provider value={{ items, addItem, deleteItem, categories }}>
      {children}
    </MenuContext.Provider>
  );
}

export const useMenu = () => useContext(MenuContext);
