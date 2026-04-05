// Image assets for the Ziwani app
// Using AI-generated placeholders from Picsum, Unsplash, and DiceBear APIs

export const imageAssets = {
  // App branding
  logo: 'https://img.icons8.com/color/96/000000/trash.png',
  
  // Category icons (real images instead of emojis)
  addBottle: 'https://img.icons8.com/color/96/000000/waste.png',
  redeemPoints: 'https://img.icons8.com/color/96/000000/gift.png',
  history: 'https://img.icons8.com/color/96/000000/timeline.png',
  profile: 'https://img.icons8.com/color/96/000000/user.png',
  
  // Redemption categories
  foodItems: 'https://img.icons8.com/color/96/000000/restaurant.png',
  dignityPacks: 'https://img.icons8.com/color/96/000000/clothes.png',
  skills: 'https://img.icons8.com/color/96/000000/online-course.png',
  
  // Food items
  bread: 'https://img.icons8.com/color/96/000000/bread.png',
  flour: 'https://img.icons8.com/color/96/000000/milling.png',
  rice: 'https://img.icons8.com/color/96/000000/rice.png',
  beans: 'https://img.icons8.com/color/96/000000/ingredients.png',
  oil: 'https://img.icons8.com/color/96/000000/olive-oil.png',
  sugar: 'https://img.icons8.com/color/96/000000/jam.png',
  milk: 'https://img.icons8.com/color/96/000000/milk-bottle.png',
  eggs: 'https://img.icons8.com/color/96/000000/eggs.png',
  
  // Dignity items
  tissue: 'https://img.icons8.com/color/96/000000/napkin.png',
  pants: 'https://img.icons8.com/color/96/000000/pants.png',
  sanitaryPads: 'https://img.icons8.com/color/96/000000/package.png',
  soap: 'https://img.icons8.com/color/96/000000/soap.png',
  toothbrush: 'https://img.icons8.com/color/96/000000/toothbrush.png',
  toothpaste: 'https://img.icons8.com/color/96/000000/toothpaste.png',
  underwear: 'https://img.icons8.com/color/96/000000/shorts.png',
  blanket: 'https://img.icons8.com/color/96/000000/blanket.png',
  tshirt: 'https://img.icons8.com/color/96/000000/t-shirt.png',
  shoes: 'https://img.icons8.com/color/96/000000/men-shoes.png',
  
  // Skills
  catering: 'https://img.icons8.com/color/96/000000/chef-hat.png',
  signLanguage: 'https://img.icons8.com/color/96/000000/hand.png',
  ict: 'https://img.icons8.com/color/96/000000/laptop.png',
  entrepreneurship: 'https://img.icons8.com/color/96/000000/combo-chart.png',
  financial: 'https://img.icons8.com/color/96/000000/money-bag.png',
  health: 'https://img.icons8.com/color/96/000000/heart.png',
  
  // Stats
  star: 'https://img.icons8.com/color/96/000000/star.png',
  target: 'https://img.icons8.com/color/96/000000/target.png',
  calendar: 'https://img.icons8.com/color/96/000000/calendar.png',
  bottle: 'https://img.icons8.com/color/96/000000/bottle.png',
  success: 'https://img.icons8.com/color/96/000000/checked.png',
  warning: 'https://img.icons8.com/color/96/000000/warning.png',
};

// Generate avatar URL from user initials or name
export const generateAvatarUrl = (name) => {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&scale=80`;
};

// Get image with fallback
export const getImageUrl = (imageKey, fallbackEmoji = '⚪') => {
  return imageAssets[imageKey] || `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="60" font-family="Arial">${fallbackEmoji}</text></svg>`;
};
