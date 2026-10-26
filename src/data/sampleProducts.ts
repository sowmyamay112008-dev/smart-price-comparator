import { Product, DealIntelligence } from '../types';

export function calculateDealMetrics(
  offers: { price: number; retailerName: string }[],
  history: { price: number; date: string }[],
  referenceMSRP: number
): DealIntelligence {
  const currentLowest = offers.length > 0 ? Math.min(...offers.map(o => o.price)) : 0;
  const bestRetailer = offers.find(o => o.price === currentLowest)?.retailerName || 'Primary Retailer';

  if (!history || history.length < 3) {
    return {
      dealLabel: 'Insufficient Price History',
      score: 50,
      historicalMedian: currentLowest,
      historicalMin: currentLowest,
      historicalMax: currentLowest,
      currentLowestPrice: currentLowest,
      nominalDiscountPercent: referenceMSRP > 0 ? Math.round(((referenceMSRP - currentLowest) / referenceMSRP) * 100) : 0,
      historicalDiscountPercent: 0,
      rationale: `Only ${history?.length || 0} historical sample records recorded. Rule requires minimum 3 verified price observations to model genuine pricing trends.`,
      confidenceRating: 'Low',
      lastEvaluated: '2026-10-25'
    };
  }

  const prices = history.map(h => h.price).sort((a, b) => a - b);
  const historicalMin = prices[0];
  const historicalMax = prices[prices.length - 1];
  const midIndex = Math.floor(prices.length / 2);
  const historicalMedian = prices.length % 2 !== 0 
    ? prices[midIndex] 
    : Math.round((prices[midIndex - 1] + prices[midIndex]) / 2);

  const nominalDiscountPercent = referenceMSRP > 0 
    ? Math.max(0, Math.round(((referenceMSRP - currentLowest) / referenceMSRP) * 100)) 
    : 0;

  const historicalDiff = historicalMedian - currentLowest;
  const historicalDiscountPercent = historicalMedian > 0 
    ? Math.round((historicalDiff / historicalMedian) * 100) 
    : 0;

  let dealLabel: 'Potential Deal' | 'Price Drop' | 'Fair Market Value' | 'Insufficient Price History' = 'Fair Market Value';
  let score = 55;
  let rationale = '';

  // Rule-based deterministic decision tree
  if (currentLowest <= historicalMin && historicalDiscountPercent >= 8) {
    dealLabel = 'Potential Deal';
    score = Math.min(96, 80 + historicalDiscountPercent);
    rationale = `Lowest current offer at $${currentLowest} from ${bestRetailer} matches or breaks the 90-day recorded historical floor ($${historicalMin}), running ${historicalDiscountPercent}% below the typical recorded median ($${historicalMedian}).`;
  } else if (historicalDiscountPercent >= 5) {
    dealLabel = 'Price Drop';
    score = Math.min(88, 70 + historicalDiscountPercent);
    rationale = `Current price of $${currentLowest} reflects a verified drop of $${historicalDiff} (${historicalDiscountPercent}%) below the 90-day median of $${historicalMedian} across multiple store offers.`;
  } else if (historicalDiscountPercent <= -5) {
    dealLabel = 'Fair Market Value';
    score = Math.max(35, 60 + historicalDiscountPercent);
    rationale = `Listed at $${currentLowest}, which is slightly elevated (${Math.abs(historicalDiscountPercent)}% above typical median of $${historicalMedian}). Price reflects standard retail range with no active promotion.`;
  } else {
    dealLabel = 'Fair Market Value';
    score = 65;
    rationale = `Current offer of $${currentLowest} sits within 4% of the historical median ($${historicalMedian}). Typical market price with standard availability.`;
  }

  return {
    dealLabel,
    score,
    historicalMedian,
    historicalMin,
    historicalMax,
    currentLowestPrice: currentLowest,
    nominalDiscountPercent,
    historicalDiscountPercent,
    rationale,
    confidenceRating: history.length >= 6 ? 'High' : 'Medium',
    lastEvaluated: '2026-10-25'
  };
}

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'Nova Ultra 5G Pro',
    brand: 'NovaTech',
    category: 'Smartphones',
    imageUrl: '/src/assets/images/dealwise_smartphone_1793025069737.jpg',
    referenceMSRP: 999,
    lowestPrice: 849,
    highestPrice: 999,
    rating: 4.8,
    reviewCount: 1420,
    specs: {
      'Display': '6.8" Quad HD+ OLED 120Hz',
      'Processor': 'Snapdragon 8 Gen 3 (4nm)',
      'Storage': '256GB UFS 4.0',
      'RAM': '12GB LPDDR5X',
      'Camera': '200MP Main + 50MP Periscope 5x',
      'Battery': '5000 mAh, 65W Fast Charge'
    },
    offers: [
      {
        id: 'off-01-1',
        retailerName: 'ElectroMart',
        price: 849,
        originalPrice: 999,
        deliveryFee: 0,
        deliveryTime: '2-3 Business Days',
        rating: 4.7,
        ratingCount: 3840,
        inStock: true,
        productUrl: 'https://example.com/electromart/nova-ultra-5g',
        isLowestPrice: true
      },
      {
        id: 'off-01-2',
        retailerName: 'CyberDepot',
        price: 889,
        originalPrice: 999,
        deliveryFee: 4.99,
        deliveryTime: '1-2 Business Days',
        rating: 4.6,
        ratingCount: 8900,
        inStock: true,
        productUrl: 'https://example.com/cyberdepot/nova-ultra-5g'
      },
      {
        id: 'off-01-3',
        retailerName: 'ApexRetail',
        price: 949,
        originalPrice: 999,
        deliveryFee: 0,
        deliveryTime: 'Standard Free (3-5 Days)',
        rating: 4.8,
        ratingCount: 15200,
        inStock: true,
        productUrl: 'https://example.com/apexretail/nova-ultra-5g'
      },
      {
        id: 'off-01-4',
        retailerName: 'GlobalStore Direct',
        price: 999,
        originalPrice: 999,
        deliveryFee: 9.99,
        deliveryTime: 'Next Day Express',
        rating: 4.5,
        ratingCount: 2100,
        inStock: false,
        productUrl: 'https://example.com/globalstore/nova-ultra-5g'
      }
    ],
    priceHistory: [
      { date: '2026-08-01', price: 999, retailer: 'ApexRetail' },
      { date: '2026-08-15', price: 979, retailer: 'CyberDepot' },
      { date: '2026-09-01', price: 949, retailer: 'ElectroMart' },
      { date: '2026-09-18', price: 949, retailer: 'ElectroMart' },
      { date: '2026-10-02', price: 899, retailer: 'CyberDepot' },
      { date: '2026-10-15', price: 879, retailer: 'ElectroMart' },
      { date: '2026-10-25', price: 849, retailer: 'ElectroMart' }
    ],
    dealIntelligence: {
      dealLabel: 'Potential Deal',
      score: 91,
      historicalMedian: 949,
      historicalMin: 849,
      historicalMax: 999,
      currentLowestPrice: 849,
      nominalDiscountPercent: 15,
      historicalDiscountPercent: 11,
      rationale: 'Lowest offer at $849 from ElectroMart is $100 (11%) below the 90-day recorded median price of $949 and represents the lowest verified price in our 90-day dataset.',
      confidenceRating: 'High',
      lastEvaluated: '2026-10-25'
    },
    lastUpdated: '2026-10-26T06:15:00Z',
    isPopular: true,
    isBestDealToday: true
  },
  {
    id: 'prod-02',
    name: 'AstraBook Pro 16 M3',
    brand: 'Astra',
    category: 'Laptops',
    imageUrl: '/src/assets/images/dealwise_laptop_1793025070888.jpg',
    referenceMSRP: 1999,
    lowestPrice: 1749,
    highestPrice: 1999,
    rating: 4.9,
    reviewCount: 960,
    specs: {
      'Display': '16.2" Liquid Retina XDR 120Hz',
      'Processor': 'Astra Octa-Core Ultra (3nm)',
      'Storage': '1TB NVMe PCIe 4.0 SSD',
      'RAM': '32GB Unified Memory',
      'Weight': '1.62 kg (3.57 lbs)',
      'Battery Life': 'Up to 22 Hours Web Browsing'
    },
    offers: [
      {
        id: 'off-02-1',
        retailerName: 'TechVault',
        price: 1749,
        originalPrice: 1999,
        deliveryFee: 0,
        deliveryTime: '2 Business Days Free',
        rating: 4.8,
        ratingCount: 5400,
        inStock: true,
        productUrl: 'https://example.com/techvault/astrabook-pro-16',
        isLowestPrice: true
      },
      {
        id: 'off-02-2',
        retailerName: 'ElectroMart',
        price: 1799,
        originalPrice: 1999,
        deliveryFee: 0,
        deliveryTime: '3-4 Business Days',
        rating: 4.7,
        ratingCount: 3840,
        inStock: true,
        productUrl: 'https://example.com/electromart/astrabook-pro-16'
      },
      {
        id: 'off-02-3',
        retailerName: 'CyberDepot',
        price: 1899,
        originalPrice: 1999,
        deliveryFee: 12.00,
        deliveryTime: 'Next Day Air',
        rating: 4.6,
        ratingCount: 8900,
        inStock: true,
        productUrl: 'https://example.com/cyberdepot/astrabook-pro-16'
      }
    ],
    priceHistory: [
      { date: '2026-08-01', price: 1999, retailer: 'TechVault' },
      { date: '2026-08-20', price: 1949, retailer: 'ElectroMart' },
      { date: '2026-09-10', price: 1899, retailer: 'TechVault' },
      { date: '2026-09-28', price: 1849, retailer: 'TechVault' },
      { date: '2026-10-12', price: 1799, retailer: 'ElectroMart' },
      { date: '2026-10-24', price: 1749, retailer: 'TechVault' }
    ],
    dealIntelligence: {
      dealLabel: 'Potential Deal',
      score: 89,
      historicalMedian: 1874,
      historicalMin: 1749,
      historicalMax: 1999,
      currentLowestPrice: 1749,
      nominalDiscountPercent: 13,
      historicalDiscountPercent: 7,
      rationale: 'Lowest offer at $1,749 matches all-time lowest recorded price. $125 cheaper than median and includes free two-day delivery.',
      confidenceRating: 'High',
      lastEvaluated: '2026-10-25'
    },
    lastUpdated: '2026-10-25T18:40:00Z',
    isPopular: true,
    isBestDealToday: true
  },
  {
    id: 'prod-03',
    name: 'Sonica Aura Q90 Wireless ANC',
    brand: 'Sonica',
    category: 'Electronics',
    imageUrl: '/src/assets/images/dealwise_headphones_1793025069730.jpg',
    referenceMSRP: 349,
    lowestPrice: 249,
    highestPrice: 349,
    rating: 4.7,
    reviewCount: 3120,
    specs: {
      'Type': 'Over-ear Active Noise Cancelling',
      'Battery': '40 hours playback (ANC on)',
      'Codecs': 'LDAC, AAC, aptX HD',
      'Weight': '250g',
      'Connectivity': 'Bluetooth 5.3 + 3.5mm Aux'
    },
    offers: [
      {
        id: 'off-03-1',
        retailerName: 'AudioSphere',
        price: 249,
        originalPrice: 349,
        deliveryFee: 0,
        deliveryTime: '2-3 Business Days',
        rating: 4.9,
        ratingCount: 1640,
        inStock: true,
        productUrl: 'https://example.com/audiosphere/sonica-aura-q90',
        isLowestPrice: true
      },
      {
        id: 'off-03-2',
        retailerName: 'ElectroMart',
        price: 269,
        originalPrice: 349,
        deliveryFee: 4.99,
        deliveryTime: '3-5 Days',
        rating: 4.7,
        ratingCount: 3840,
        inStock: true,
        productUrl: 'https://example.com/electromart/sonica-aura-q90'
      },
      {
        id: 'off-03-3',
        retailerName: 'ApexRetail',
        price: 299,
        originalPrice: 349,
        deliveryFee: 0,
        deliveryTime: 'Standard Free',
        rating: 4.8,
        ratingCount: 15200,
        inStock: true,
        productUrl: 'https://example.com/apexretail/sonica-aura-q90'
      }
    ],
    priceHistory: [
      { date: '2026-08-05', price: 349, retailer: 'ApexRetail' },
      { date: '2026-08-25', price: 329, retailer: 'AudioSphere' },
      { date: '2026-09-12', price: 299, retailer: 'ElectroMart' },
      { date: '2026-10-01', price: 299, retailer: 'AudioSphere' },
      { date: '2026-10-18', price: 279, retailer: 'AudioSphere' },
      { date: '2026-10-25', price: 249, retailer: 'AudioSphere' }
    ],
    dealIntelligence: {
      dealLabel: 'Potential Deal',
      score: 93,
      historicalMedian: 314,
      historicalMin: 249,
      historicalMax: 349,
      currentLowestPrice: 249,
      nominalDiscountPercent: 29,
      historicalDiscountPercent: 21,
      rationale: 'AudioSphere promotion brings price to $249, which is 21% lower than the 90-day typical median of $314. One of the strongest verified drops in audio equipment.',
      confidenceRating: 'High',
      lastEvaluated: '2026-10-25'
    },
    lastUpdated: '2026-10-26T04:20:00Z',
    isPopular: true,
    isBestDealToday: true
  },
  {
    id: 'prod-04',
    name: 'ChronoSync Titan Smartwatch',
    brand: 'ChronoSync',
    category: 'Accessories',
    imageUrl: '/src/assets/images/dealwise_smartwatch_1793025070161.jpg',
    referenceMSRP: 379,
    lowestPrice: 279,
    highestPrice: 379,
    rating: 4.6,
    reviewCount: 880,
    specs: {
      'Material': 'Titanium Grade 2 + Sapphire Crystal',
      'Display': '1.43" AMOLED 466x466 (1000 nits)',
      'Sensors': 'ECG, SpO2, Skin Temp, Heart Rate',
      'Water Resistance': '50m (5 ATM) + Swim Tracking',
      'Battery Life': 'Up to 7 Days Typical Use'
    },
    offers: [
      {
        id: 'off-04-1',
        retailerName: 'CyberDepot',
        price: 279,
        originalPrice: 379,
        deliveryFee: 0,
        deliveryTime: '2 Days Free',
        rating: 4.6,
        ratingCount: 8900,
        inStock: true,
        productUrl: 'https://example.com/cyberdepot/chronosync-titan',
        isLowestPrice: true
      },
      {
        id: 'off-04-2',
        retailerName: 'ApexRetail',
        price: 299,
        originalPrice: 379,
        deliveryFee: 0,
        deliveryTime: '3-4 Days',
        rating: 4.8,
        ratingCount: 15200,
        inStock: true,
        productUrl: 'https://example.com/apexretail/chronosync-titan'
      },
      {
        id: 'off-04-3',
        retailerName: 'ElectroMart',
        price: 329,
        originalPrice: 379,
        deliveryFee: 5.00,
        deliveryTime: 'Standard Shipping',
        rating: 4.7,
        ratingCount: 3840,
        inStock: true,
        productUrl: 'https://example.com/electromart/chronosync-titan'
      }
    ],
    priceHistory: [
      { date: '2026-08-01', price: 379, retailer: 'ApexRetail' },
      { date: '2026-08-20', price: 359, retailer: 'CyberDepot' },
      { date: '2026-09-10', price: 349, retailer: 'ElectroMart' },
      { date: '2026-09-30', price: 329, retailer: 'ApexRetail' },
      { date: '2026-10-15', price: 299, retailer: 'CyberDepot' },
      { date: '2026-10-25', price: 279, retailer: 'CyberDepot' }
    ],
    dealIntelligence: {
      dealLabel: 'Price Drop',
      score: 86,
      historicalMedian: 339,
      historicalMin: 279,
      historicalMax: 379,
      currentLowestPrice: 279,
      nominalDiscountPercent: 26,
      historicalDiscountPercent: 18,
      rationale: 'CyberDepot lists at $279, an $18% decrease below the typical 90-day recorded price ($339). Verified retailer stock.',
      confidenceRating: 'High',
      lastEvaluated: '2026-10-25'
    },
    lastUpdated: '2026-10-25T11:30:00Z',
    isPopular: true,
    isBestDealToday: false
  },
  {
    id: 'prod-05',
    name: 'PixelApex Pro 9',
    brand: 'Apex',
    category: 'Smartphones',
    imageUrl: '/src/assets/images/dealwise_smartphone_1793025069737.jpg',
    referenceMSRP: 899,
    lowestPrice: 749,
    highestPrice: 899,
    rating: 4.7,
    reviewCount: 2150,
    specs: {
      'Display': '6.7" OLED LTPO 1-120Hz',
      'Processor': 'Tensor G4 AI Engine',
      'Storage': '128GB NVMe',
      'RAM': '16GB LPDDR5X',
      'Camera': '50MP Primary + 48MP Ultrawide Macro',
      'Battery': '5050 mAh, 30W Wired'
    },
    offers: [
      {
        id: 'off-05-1',
        retailerName: 'ElectroMart',
        price: 749,
        originalPrice: 899,
        deliveryFee: 0,
        deliveryTime: '2-3 Business Days',
        rating: 4.7,
        ratingCount: 3840,
        inStock: true,
        productUrl: 'https://example.com/electromart/pixelapex-pro-9',
        isLowestPrice: true
      },
      {
        id: 'off-05-2',
        retailerName: 'ApexRetail',
        price: 799,
        originalPrice: 899,
        deliveryFee: 0,
        deliveryTime: 'Free Express',
        rating: 4.8,
        ratingCount: 15200,
        inStock: true,
        productUrl: 'https://example.com/apexretail/pixelapex-pro-9'
      },
      {
        id: 'off-05-3',
        retailerName: 'GlobalStore Direct',
        price: 849,
        originalPrice: 899,
        deliveryFee: 4.99,
        deliveryTime: 'Standard',
        rating: 4.5,
        ratingCount: 2100,
        inStock: true,
        productUrl: 'https://example.com/globalstore/pixelapex-pro-9'
      }
    ],
    priceHistory: [
      { date: '2026-08-10', price: 899, retailer: 'ApexRetail' },
      { date: '2026-08-28', price: 899, retailer: 'ApexRetail' },
      { date: '2026-09-15', price: 849, retailer: 'ElectroMart' },
      { date: '2026-10-05', price: 799, retailer: 'ElectroMart' },
      { date: '2026-10-22', price: 749, retailer: 'ElectroMart' }
    ],
    dealIntelligence: {
      dealLabel: 'Price Drop',
      score: 84,
      historicalMedian: 849,
      historicalMin: 749,
      historicalMax: 899,
      currentLowestPrice: 749,
      nominalDiscountPercent: 17,
      historicalDiscountPercent: 12,
      rationale: 'ElectroMart price is $100 below recorded median of $849. Verified inventory available with free delivery.',
      confidenceRating: 'Medium',
      lastEvaluated: '2026-10-25'
    },
    lastUpdated: '2026-10-25T09:10:00Z',
    isPopular: false,
    isBestDealToday: false
  },
  {
    id: 'prod-06',
    name: 'ZenFlow Slim 14 OLED',
    brand: 'ZenFlow',
    category: 'Laptops',
    imageUrl: '/src/assets/images/dealwise_laptop_1793025070888.jpg',
    referenceMSRP: 1099,
    lowestPrice: 929,
    highestPrice: 1099,
    rating: 4.6,
    reviewCount: 640,
    specs: {
      'Display': '14.0" 2.8K OLED 16:10 120Hz',
      'Processor': 'Intel Core Ultra 7 155H',
      'Storage': '512GB PCIe 4.0',
      'RAM': '16GB LPDDR5X',
      'Weight': '1.2 kg Ultra-portable',
      'Battery': '75 Wh, 65W USB-C'
    },
    offers: [
      {
        id: 'off-06-1',
        retailerName: 'CyberDepot',
        price: 929,
        originalPrice: 1099,
        deliveryFee: 0,
        deliveryTime: '2-3 Days',
        rating: 4.6,
        ratingCount: 8900,
        inStock: true,
        productUrl: 'https://example.com/cyberdepot/zenflow-slim-14',
        isLowestPrice: true
      },
      {
        id: 'off-06-2',
        retailerName: 'TechVault',
        price: 979,
        originalPrice: 1099,
        deliveryFee: 0,
        deliveryTime: '3-5 Days',
        rating: 4.8,
        ratingCount: 5400,
        inStock: true,
        productUrl: 'https://example.com/techvault/zenflow-slim-14'
      },
      {
        id: 'off-06-3',
        retailerName: 'ApexRetail',
        price: 1049,
        originalPrice: 1099,
        deliveryFee: 0,
        deliveryTime: 'Standard Free',
        rating: 4.8,
        ratingCount: 15200,
        inStock: true,
        productUrl: 'https://example.com/apexretail/zenflow-slim-14'
      }
    ],
    priceHistory: [
      { date: '2026-08-01', price: 1099, retailer: 'ApexRetail' },
      { date: '2026-08-25', price: 1049, retailer: 'TechVault' },
      { date: '2026-09-18', price: 999, retailer: 'CyberDepot' },
      { date: '2026-10-10', price: 959, retailer: 'CyberDepot' },
      { date: '2026-10-25', price: 929, retailer: 'CyberDepot' }
    ],
    dealIntelligence: {
      dealLabel: 'Price Drop',
      score: 81,
      historicalMedian: 999,
      historicalMin: 929,
      historicalMax: 1099,
      currentLowestPrice: 929,
      nominalDiscountPercent: 15,
      historicalDiscountPercent: 7,
      rationale: 'Listed at $929 on CyberDepot, $70 below typical median. Strong option for students requiring OLED display and lightweight portability.',
      confidenceRating: 'Medium',
      lastEvaluated: '2026-10-25'
    },
    lastUpdated: '2026-10-25T14:15:00Z',
    isPopular: false,
    isBestDealToday: false
  },
  {
    id: 'prod-07',
    name: 'CleanBot RoboVac X8 Pro',
    brand: 'CleanBot',
    category: 'Home Appliances',
    imageUrl: '/src/assets/images/dealwise_smartwatch_1793025070161.jpg',
    referenceMSRP: 599,
    lowestPrice: 419,
    highestPrice: 599,
    rating: 4.5,
    reviewCount: 1840,
    specs: {
      'Navigation': '3D LiDAR + AI Obstacle Recognition',
      'Suction Power': '5000 Pa Deep Clean',
      'Mopping': 'Vibrating Sonic Mop with Auto-Lift',
      'Base Station': 'Self-Emptying 60-Day Dust Bag',
      'Run Time': '180 Minutes (3200 sq ft coverage)'
    },
    offers: [
      {
        id: 'off-07-1',
        retailerName: 'HomeTech Central',
        price: 419,
        originalPrice: 599,
        deliveryFee: 0,
        deliveryTime: 'Free 2-Day',
        rating: 4.6,
        ratingCount: 3100,
        inStock: true,
        productUrl: 'https://example.com/hometech/cleanbot-x8-pro',
        isLowestPrice: true
      },
      {
        id: 'off-07-2',
        retailerName: 'ElectroMart',
        price: 479,
        originalPrice: 599,
        deliveryFee: 9.99,
        deliveryTime: 'Standard Ground',
        rating: 4.7,
        ratingCount: 3840,
        inStock: true,
        productUrl: 'https://example.com/electromart/cleanbot-x8-pro'
      },
      {
        id: 'off-07-3',
        retailerName: 'ApexRetail',
        price: 529,
        originalPrice: 599,
        deliveryFee: 0,
        deliveryTime: 'Free Shipping',
        rating: 4.8,
        ratingCount: 15200,
        inStock: true,
        productUrl: 'https://example.com/apexretail/cleanbot-x8-pro'
      }
    ],
    priceHistory: [
      { date: '2026-08-01', price: 599, retailer: 'ApexRetail' },
      { date: '2026-08-20', price: 549, retailer: 'ElectroMart' },
      { date: '2026-09-12', price: 499, retailer: 'HomeTech Central' },
      { date: '2026-10-01', price: 469, retailer: 'HomeTech Central' },
      { date: '2026-10-22', price: 419, retailer: 'HomeTech Central' }
    ],
    dealIntelligence: {
      dealLabel: 'Potential Deal',
      score: 90,
      historicalMedian: 499,
      historicalMin: 419,
      historicalMax: 599,
      currentLowestPrice: 419,
      nominalDiscountPercent: 30,
      historicalDiscountPercent: 16,
      rationale: 'Significant $80 reduction below 90-day median ($499) at HomeTech Central. Genuine discount validated against multiple competing retailer baseline prices.',
      confidenceRating: 'High',
      lastEvaluated: '2026-10-25'
    },
    lastUpdated: '2026-10-26T01:10:00Z',
    isPopular: true,
    isBestDealToday: true
  },
  {
    id: 'prod-08',
    name: 'AeroBreeze Smart Air Purifier HEPA',
    brand: 'AeroBreeze',
    category: 'Home Appliances',
    imageUrl: '/src/assets/images/dealwise_smartwatch_1793025070161.jpg',
    referenceMSRP: 219,
    lowestPrice: 169,
    highestPrice: 219,
    rating: 4.8,
    reviewCount: 920,
    specs: {
      'Coverage': 'Up to 1050 sq ft in 30 mins',
      'Filter': 'H13 True HEPA + Activated Carbon',
      'Noise Level': 'Ultra-quiet 22dB Sleep Mode',
      'Smart App': 'PM2.5 Realtime Sensor & Air Quality Indicator',
      'Power': '38W Energy Star Certified'
    },
    offers: [
      {
        id: 'off-08-1',
        retailerName: 'HomeTech Central',
        price: 169,
        originalPrice: 219,
        deliveryFee: 0,
        deliveryTime: 'Free Standard',
        rating: 4.6,
        ratingCount: 3100,
        inStock: true,
        productUrl: 'https://example.com/hometech/aerobreeze-hepa',
        isLowestPrice: true
      },
      {
        id: 'off-08-2',
        retailerName: 'ApexRetail',
        price: 189,
        originalPrice: 219,
        deliveryFee: 0,
        deliveryTime: '2-Day Free',
        rating: 4.8,
        ratingCount: 15200,
        inStock: true,
        productUrl: 'https://example.com/apexretail/aerobreeze-hepa'
      }
    ],
    priceHistory: [
      { date: '2026-08-15', price: 219, retailer: 'ApexRetail' },
      { date: '2026-09-10', price: 199, retailer: 'HomeTech Central' },
      { date: '2026-10-05', price: 179, retailer: 'HomeTech Central' },
      { date: '2026-10-23', price: 169, retailer: 'HomeTech Central' }
    ],
    dealIntelligence: {
      dealLabel: 'Price Drop',
      score: 79,
      historicalMedian: 189,
      historicalMin: 169,
      historicalMax: 219,
      currentLowestPrice: 169,
      nominalDiscountPercent: 23,
      historicalDiscountPercent: 11,
      rationale: 'Lowest price at $169 is 11% below median. Modest history sample (4 data points) confirms sustained downward price adjustment.',
      confidenceRating: 'Medium',
      lastEvaluated: '2026-10-25'
    },
    lastUpdated: '2026-10-25T16:00:00Z',
    isPopular: false,
    isBestDealToday: false
  },
  {
    id: 'prod-09',
    name: 'Velocity Sport Wireless Earbuds',
    brand: 'Velocity',
    category: 'Electronics',
    imageUrl: '/src/assets/images/dealwise_headphones_1793025069730.jpg',
    referenceMSRP: 129,
    lowestPrice: 89,
    highestPrice: 129,
    rating: 4.4,
    reviewCount: 1560,
    specs: {
      'Water Resistance': 'IPX7 Sweat & Waterproof',
      'Fit': 'Secure ear-hook design for workouts',
      'Battery': '8 hrs per charge, 32 hrs total with case',
      'Charging': 'Qi Wireless + USB-C Quick Charge (10m = 2hrs)'
    },
    offers: [
      {
        id: 'off-09-1',
        retailerName: 'AudioSphere',
        price: 89,
        originalPrice: 129,
        deliveryFee: 0,
        deliveryTime: '2-3 Days Free',
        rating: 4.9,
        ratingCount: 1640,
        inStock: true,
        productUrl: 'https://example.com/audiosphere/velocity-sport',
        isLowestPrice: true
      },
      {
        id: 'off-09-2',
        retailerName: 'CyberDepot',
        price: 99,
        originalPrice: 129,
        deliveryFee: 3.99,
        deliveryTime: 'Standard',
        rating: 4.6,
        ratingCount: 8900,
        inStock: true,
        productUrl: 'https://example.com/cyberdepot/velocity-sport'
      },
      {
        id: 'off-09-3',
        retailerName: 'ElectroMart',
        price: 119,
        originalPrice: 129,
        deliveryFee: 0,
        deliveryTime: 'Free Shipping',
        rating: 4.7,
        ratingCount: 3840,
        inStock: true,
        productUrl: 'https://example.com/electromart/velocity-sport'
      }
    ],
    priceHistory: [
      { date: '2026-08-10', price: 129, retailer: 'CyberDepot' },
      { date: '2026-09-01', price: 119, retailer: 'AudioSphere' },
      { date: '2026-09-22', price: 99, retailer: 'AudioSphere' },
      { date: '2026-10-15', price: 89, retailer: 'AudioSphere' }
    ],
    dealIntelligence: {
      dealLabel: 'Price Drop',
      score: 82,
      historicalMedian: 109,
      historicalMin: 89,
      historicalMax: 129,
      currentLowestPrice: 89,
      nominalDiscountPercent: 31,
      historicalDiscountPercent: 18,
      rationale: '$40 discount against $129 list price. Sits $20 lower than typical median ($109). Great price-performance ratio for gym and running enthusiasts.',
      confidenceRating: 'Medium',
      lastEvaluated: '2026-10-25'
    },
    lastUpdated: '2026-10-25T13:45:00Z',
    isPopular: false,
    isBestDealToday: false
  },
  {
    id: 'prod-10',
    name: 'OmniCharge 100W GaN Travel Hub',
    brand: 'OmniCharge',
    category: 'Accessories',
    imageUrl: '/src/assets/images/dealwise_smartwatch_1793025070161.jpg',
    referenceMSRP: 79,
    lowestPrice: 59,
    highestPrice: 79,
    rating: 4.7,
    reviewCount: 3200,
    specs: {
      'Total Output': '100W Max GaN III Technology',
      'Ports': '3x USB-C (PD 3.0), 1x USB-A (QC 4.0)',
      'Dimensions': '65 x 65 x 32 mm foldable prongs',
      'Protection': 'Over-voltage, Over-temp, Short-circuit protection'
    },
    offers: [
      {
        id: 'off-10-1',
        retailerName: 'TechVault',
        price: 59,
        originalPrice: 79,
        deliveryFee: 0,
        deliveryTime: 'Free Standard',
        rating: 4.8,
        ratingCount: 5400,
        inStock: true,
        productUrl: 'https://example.com/techvault/omnicharge-100w',
        isLowestPrice: true
      },
      {
        id: 'off-10-2',
        retailerName: 'CyberDepot',
        price: 64,
        originalPrice: 79,
        deliveryFee: 2.99,
        deliveryTime: '2-Day',
        rating: 4.6,
        ratingCount: 8900,
        inStock: true,
        productUrl: 'https://example.com/cyberdepot/omnicharge-100w'
      },
      {
        id: 'off-10-3',
        retailerName: 'ApexRetail',
        price: 69,
        originalPrice: 79,
        deliveryFee: 0,
        deliveryTime: 'Free 2-Day',
        rating: 4.8,
        ratingCount: 15200,
        inStock: true,
        productUrl: 'https://example.com/apexretail/omnicharge-100w'
      }
    ],
    priceHistory: [
      { date: '2026-08-01', price: 79, retailer: 'ApexRetail' },
      { date: '2026-08-25', price: 72, retailer: 'CyberDepot' },
      { date: '2026-09-18', price: 69, retailer: 'TechVault' },
      { date: '2026-10-10', price: 62, retailer: 'TechVault' },
      { date: '2026-10-24', price: 59, retailer: 'TechVault' }
    ],
    dealIntelligence: {
      dealLabel: 'Price Drop',
      score: 78,
      historicalMedian: 69,
      historicalMin: 59,
      historicalMax: 79,
      currentLowestPrice: 59,
      nominalDiscountPercent: 25,
      historicalDiscountPercent: 14,
      rationale: '$59 is the lowest recorded observation across 5 sample intervals, saving $10 relative to the 90-day recorded median of $69.',
      confidenceRating: 'Medium',
      lastEvaluated: '2026-10-25'
    },
    lastUpdated: '2026-10-25T15:20:00Z',
    isPopular: false,
    isBestDealToday: false
  },
  {
    id: 'prod-11',
    name: 'BaristaPulse 15-Bar Espresso Maker',
    brand: 'BaristaPulse',
    category: 'Home Appliances',
    imageUrl: '/src/assets/images/dealwise_smartwatch_1793025070161.jpg',
    referenceMSRP: 450,
    lowestPrice: 349,
    highestPrice: 450,
    rating: 4.8,
    reviewCount: 740,
    specs: {
      'Pump Pressure': '15-Bar Italian Ulka Pump',
      'Heating System': 'ThermoBlock Fast Heat-up (35s)',
      'Steam Wand': 'Commercial Style 360-degree Microfoam Wand',
      'Portafilter': '54mm Stainless Steel with Dual/Single Baskets',
      'Water Tank': '1.8L Removable with Water Filter'
    },
    offers: [
      {
        id: 'off-11-1',
        retailerName: 'HomeTech Central',
        price: 349,
        originalPrice: 450,
        deliveryFee: 0,
        deliveryTime: 'Free Freight 3-Day',
        rating: 4.6,
        ratingCount: 3100,
        inStock: true,
        productUrl: 'https://example.com/hometech/baristapulse-espresso',
        isLowestPrice: true
      },
      {
        id: 'off-11-2',
        retailerName: 'ApexRetail',
        price: 389,
        originalPrice: 450,
        deliveryFee: 0,
        deliveryTime: 'Free Shipping',
        rating: 4.8,
        ratingCount: 15200,
        inStock: true,
        productUrl: 'https://example.com/apexretail/baristapulse-espresso'
      },
      {
        id: 'off-11-3',
        retailerName: 'ElectroMart',
        price: 419,
        originalPrice: 450,
        deliveryFee: 14.99,
        deliveryTime: 'Ground Freight',
        rating: 4.7,
        ratingCount: 3840,
        inStock: true,
        productUrl: 'https://example.com/electromart/baristapulse-espresso'
      }
    ],
    priceHistory: [
      { date: '2026-08-01', price: 450, retailer: 'ApexRetail' },
      { date: '2026-08-20', price: 429, retailer: 'ElectroMart' },
      { date: '2026-09-10', price: 399, retailer: 'HomeTech Central' },
      { date: '2026-10-02', price: 379, retailer: 'HomeTech Central' },
      { date: '2026-10-20', price: 349, retailer: 'HomeTech Central' }
    ],
    dealIntelligence: {
      dealLabel: 'Potential Deal',
      score: 88,
      historicalMedian: 399,
      historicalMin: 349,
      historicalMax: 450,
      currentLowestPrice: 349,
      nominalDiscountPercent: 22,
      historicalDiscountPercent: 13,
      rationale: '$101 discount from $450 MSRP and $50 lower than the $399 median. Verified high stock at HomeTech Central with free shipping.',
      confidenceRating: 'High',
      lastEvaluated: '2026-10-25'
    },
    lastUpdated: '2026-10-25T12:00:00Z',
    isPopular: false,
    isBestDealToday: false
  },
  {
    id: 'prod-12',
    name: 'Titan Horizon 15 Gaming Laptop',
    brand: 'Titan',
    category: 'Laptops',
    imageUrl: '/src/assets/images/dealwise_laptop_1793025070888.jpg',
    referenceMSRP: 1499,
    lowestPrice: 1299,
    highestPrice: 1499,
    rating: 4.7,
    reviewCount: 1100,
    specs: {
      'Display': '15.6" QHD 165Hz IPS 3ms G-Sync',
      'Processor': 'AMD Ryzen 7 8845HS (8 Cores, 16 Threads)',
      'GPU': 'NVIDIA GeForce RTX 4070 8GB GDDR6 (140W TGP)',
      'Storage': '1TB Gen4 NVMe SSD',
      'RAM': '16GB DDR5 5600MHz (expandable to 64GB)'
    },
    offers: [
      {
        id: 'off-12-1',
        retailerName: 'CyberDepot',
        price: 1299,
        originalPrice: 1499,
        deliveryFee: 0,
        deliveryTime: 'Free Express',
        rating: 4.6,
        ratingCount: 8900,
        inStock: true,
        productUrl: 'https://example.com/cyberdepot/titan-horizon-15',
        isLowestPrice: true
      },
      {
        id: 'off-12-2',
        retailerName: 'TechVault',
        price: 1369,
        originalPrice: 1499,
        deliveryFee: 0,
        deliveryTime: '2-Day Shipping',
        rating: 4.8,
        ratingCount: 5400,
        inStock: true,
        productUrl: 'https://example.com/techvault/titan-horizon-15'
      },
      {
        id: 'off-12-3',
        retailerName: 'ElectroMart',
        price: 1449,
        originalPrice: 1499,
        deliveryFee: 9.99,
        deliveryTime: 'Standard',
        rating: 4.7,
        ratingCount: 3840,
        inStock: false,
        productUrl: 'https://example.com/electromart/titan-horizon-15'
      }
    ],
    priceHistory: [
      { date: '2026-08-10', price: 1499, retailer: 'TechVault' },
      { date: '2026-09-01', price: 1449, retailer: 'ElectroMart' },
      { date: '2026-09-20', price: 1399, retailer: 'CyberDepot' },
      { date: '2026-10-15', price: 1329, retailer: 'CyberDepot' },
      { date: '2026-10-25', price: 1299, retailer: 'CyberDepot' }
    ],
    dealIntelligence: {
      dealLabel: 'Price Drop',
      score: 83,
      historicalMedian: 1399,
      historicalMin: 1299,
      historicalMax: 1499,
      currentLowestPrice: 1299,
      nominalDiscountPercent: 13,
      historicalDiscountPercent: 7,
      rationale: '$200 off list price and $100 lower than the $1,399 recorded median price. Solid performance per dollar for modern RTX 4070 gaming rigs.',
      confidenceRating: 'Medium',
      lastEvaluated: '2026-10-25'
    },
    lastUpdated: '2026-10-25T17:00:00Z',
    isPopular: true,
    isBestDealToday: false
  },
  {
    id: 'prod-13',
    name: 'EdgeLite Neo 5G Midrange',
    brand: 'NovaTech',
    category: 'Smartphones',
    imageUrl: '/src/assets/images/dealwise_smartphone_1793025069737.jpg',
    referenceMSRP: 449,
    lowestPrice: 389,
    highestPrice: 449,
    rating: 4.5,
    reviewCount: 1680,
    specs: {
      'Display': '6.55" FHD+ AMOLED 120Hz',
      'Processor': 'MediaTek Dimensity 8200-Ultra',
      'Storage': '128GB UFS 3.1',
      'RAM': '8GB RAM',
      'Battery': '5000 mAh with 67W Turbo Charger in box'
    },
    offers: [
      {
        id: 'off-13-1',
        retailerName: 'ElectroMart',
        price: 389,
        originalPrice: 449,
        deliveryFee: 0,
        deliveryTime: '2-3 Days Free',
        rating: 4.7,
        ratingCount: 3840,
        inStock: true,
        productUrl: 'https://example.com/electromart/edgelite-neo-5g',
        isLowestPrice: true
      },
      {
        id: 'off-13-2',
        retailerName: 'CyberDepot',
        price: 409,
        originalPrice: 449,
        deliveryFee: 0,
        deliveryTime: '3-4 Days Free',
        rating: 4.6,
        ratingCount: 8900,
        inStock: true,
        productUrl: 'https://example.com/cyberdepot/edgelite-neo-5g'
      }
    ],
    priceHistory: [
      { date: '2026-08-15', price: 449, retailer: 'ElectroMart' },
      { date: '2026-09-05', price: 429, retailer: 'CyberDepot' },
      { date: '2026-09-25', price: 409, retailer: 'ElectroMart' },
      { date: '2026-10-18', price: 389, retailer: 'ElectroMart' }
    ],
    dealIntelligence: {
      dealLabel: 'Price Drop',
      score: 77,
      historicalMedian: 419,
      historicalMin: 389,
      historicalMax: 449,
      currentLowestPrice: 389,
      nominalDiscountPercent: 13,
      historicalDiscountPercent: 7,
      rationale: '$60 below MSRP and $30 under median ($419). Excellent mid-range budget pick with high refresh screen.',
      confidenceRating: 'Medium',
      lastEvaluated: '2026-10-25'
    },
    lastUpdated: '2026-10-25T14:40:00Z',
    isPopular: false,
    isBestDealToday: false
  },
  {
    id: 'prod-14',
    name: 'SoundWave Pulse Studio Soundbar',
    brand: 'Sonica',
    category: 'Electronics',
    imageUrl: '/src/assets/images/dealwise_headphones_1793025069730.jpg',
    referenceMSRP: 299,
    lowestPrice: 289,
    highestPrice: 299,
    rating: 4.3,
    reviewCount: 420,
    specs: {
      'Channels': '3.1 Channel with Wireless Subwoofer',
      'Audio Formats': 'Dolby Atmos & DTS Virtual:X',
      'Connectivity': 'HDMI eARC, Optical, Bluetooth 5.2',
      'Peak Power': '320W Total Output'
    },
    offers: [
      {
        id: 'off-14-1',
        retailerName: 'AudioSphere',
        price: 289,
        originalPrice: 299,
        deliveryFee: 0,
        deliveryTime: 'Free Shipping',
        rating: 4.9,
        ratingCount: 1640,
        inStock: true,
        productUrl: 'https://example.com/audiosphere/soundwave-pulse',
        isLowestPrice: true
      },
      {
        id: 'off-14-2',
        retailerName: 'ApexRetail',
        price: 299,
        originalPrice: 299,
        deliveryFee: 0,
        deliveryTime: 'Standard Free',
        rating: 4.8,
        ratingCount: 15200,
        inStock: true,
        productUrl: 'https://example.com/apexretail/soundwave-pulse'
      }
    ],
    priceHistory: [
      { date: '2026-09-01', price: 299, retailer: 'AudioSphere' },
      { date: '2026-10-01', price: 295, retailer: 'AudioSphere' }
    ],
    dealIntelligence: {
      dealLabel: 'Insufficient Price History',
      score: 52,
      historicalMedian: 297,
      historicalMin: 289,
      historicalMax: 299,
      currentLowestPrice: 289,
      nominalDiscountPercent: 3,
      historicalDiscountPercent: 3,
      rationale: 'Only 2 recorded historical price observations available. Rule requires at least 3 distinct recorded observations to determine fair market distribution.',
      confidenceRating: 'Low',
      lastEvaluated: '2026-10-25'
    },
    lastUpdated: '2026-10-25T10:00:00Z',
    isPopular: false,
    isBestDealToday: false
  }
];
