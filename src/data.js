export const categories = [
  { id: 'audio', icon: '♫', tone: 'blue' },
  { id: 'lighting', icon: '✦', tone: 'red' },
  { id: 'furniture', icon: '▤', tone: 'green' },
  { id: 'decor', icon: '✿', tone: 'red' },
  { id: 'photo', icon: '◉', tone: 'blue' },
  { id: 'catering', icon: '♨', tone: 'green' },
];

export const eventTypes = [
  { id: 'wedding', category: 'decor' },
  { id: 'birthday', category: 'photo' },
  { id: 'corporate', category: 'audio' },
  { id: 'conference', category: 'audio' },
  { id: 'concert', category: 'lighting' },
  { id: 'family', category: 'furniture' },
];

export const seedProducts = [
  {
    id: 'sound-pro', category: 'audio', icon: '🔊', art: 'art-blue', price: 480000, rating: 4.9, reviews: 36, stock: 4, featured: true, badge: 'popular', vendorName: 'SoundLab',
    title: { uz: 'Professional ovoz tizimi', ru: 'Профессиональная звуковая система', en: 'Professional sound system' },
    description: { uz: 'To‘y, konsert va korporativ tadbirlar uchun tiniq, kuchli ovoz. Tajribali hamkorimiz o‘rnatish bo‘yicha ham yordam beradi.', ru: 'Чистый и мощный звук для свадеб, концертов и корпоративов. Наш партнёр также поможет с настройкой.', en: 'Clear, powerful sound for weddings, concerts, and corporate events. Our partner can help with setup, too.' },
    includes: { uz: ['2 ta faol akustik kolonkа', 'Mikser va kabellar', '2 ta simsiz mikrofon'], ru: ['2 активные акустические колонки', 'Микшер и кабели', '2 беспроводных микрофона'], en: ['2 active speakers', 'Mixer and cables', '2 wireless microphones'] },
  },
  {
    id: 'festoon-lights', category: 'lighting', icon: '💡', art: 'art-amber', price: 320000, rating: 4.8, reviews: 28, stock: 8, featured: true, badge: 'popular', vendorName: 'Lumen Studio',
    title: { uz: 'Bayramona yoritish to‘plami', ru: 'Набор праздничного освещения', en: 'Festive lighting set' },
    description: { uz: 'Maydon yoki zalga iliq va esda qolarli muhit bag‘ishlaydigan, oson boshqariladigan yoritish to‘plami.', ru: 'Удобный комплект освещения, который создаст тёплую и запоминающуюся атмосферу в зале или на площадке.', en: 'An easy-to-control lighting set that brings a warm, memorable atmosphere to your venue.' },
    includes: { uz: ['12 ta LED chiroq', 'Boshqaruv pulti', 'O‘rnatish uchun tayanchlar'], ru: ['12 LED-светильников', 'Пульт управления', 'Крепления для установки'], en: ['12 LED lights', 'Remote control', 'Mounting stands'] },
  },
  {
    id: 'banquet-set', category: 'furniture', icon: '🪑', art: 'art-green', price: 240000, rating: 4.9, reviews: 42, stock: 12, featured: true, badge: 'popular', vendorName: 'Grand Table',
    title: { uz: 'Banket stoli va 10 ta stul', ru: 'Банкетный стол и 10 стульев', en: 'Banquet table & 10 chairs' },
    description: { uz: 'Mehmonlarni qulay kutib olish uchun chiroyli, toza va mustahkam mebel to‘plami.', ru: 'Аккуратный и прочный комплект мебели, чтобы с комфортом принять гостей.', en: 'A clean, sturdy furniture set for welcoming your guests in comfort.' },
    includes: { uz: ['1 ta 10 kishilik stol', '10 ta yumshoq stul', 'Oq dasturxon'], ru: ['1 стол на 10 гостей', '10 мягких стульев', 'Белая скатерть'], en: ['1 table for 10 guests', '10 cushioned chairs', 'White tablecloth'] },
  },
  {
    id: 'floral-arch', category: 'decor', icon: '💐', art: 'art-rose', price: 420000, rating: 5.0, reviews: 19, stock: 3, featured: true, badge: 'new', vendorName: 'Bloom Events',
    title: { uz: 'Gulli fotozona va arka', ru: 'Цветочная фотозона с аркой', en: 'Floral photo backdrop & arch' },
    description: { uz: 'Tabiiy ranglardagi gullar va nafis arka bilan tadbiringiz uchun chiroyli fotozona.', ru: 'Элегантная фотозона с аркой и цветами в естественной палитре для вашего праздника.', en: 'An elegant event photo backdrop with a floral arch in a natural color palette.' },
    includes: { uz: ['2,2 metrli dekorativ arka', 'Mavsumiy sun’iy gullar', 'Matoli fon'], ru: ['Декоративная арка высотой 2,2 м', 'Сезонные искусственные цветы', 'Тканевый фон'], en: ['2.2 m decorative arch', 'Seasonal faux flowers', 'Fabric backdrop'] },
  },
  {
    id: 'photo-booth', category: 'photo', icon: '📸', art: 'art-violet', price: 550000, rating: 4.9, reviews: 31, stock: 2, featured: true, badge: 'popular', vendorName: 'Frame by Frame',
    title: { uz: 'Foto burchak va instant kamera', ru: 'Фотобудка с моментальной печатью', en: 'Photo booth with instant prints' },
    description: { uz: 'Mehmonlaringizga suratga tushib, esdalik suratlarini olib ketish imkonini bering.', ru: 'Подарите гостям возможность сделать фото и сразу забрать памятный снимок.', en: 'Give your guests a fun photo moment and an instant print to take home.' },
    includes: { uz: ['Instant kamera va printer', 'Cheksiz foto qog‘oz', 'Tanlovingizdagi fon'], ru: ['Камера моментальной печати', 'Бумага для неограниченной печати', 'Фон на выбор'], en: ['Instant camera and printer', 'Unlimited photo paper', 'Backdrop of your choice'] },
  },
  {
    id: 'stage-podium', category: 'decor', icon: '🎤', art: 'art-red', price: 380000, rating: 4.7, reviews: 16, stock: 5, featured: false, badge: '', vendorName: 'StageCraft',
    title: { uz: 'Sahna va podium to‘plami', ru: 'Комплект сцены и подиума', en: 'Stage & podium package' },
    description: { uz: 'Nutq, taqdimot va jonli chiqishlar uchun ixcham, modulli sahna to‘plami.', ru: 'Компактная модульная сцена для выступлений, презентаций и живых шоу.', en: 'A compact, modular stage setup for speeches, presentations, and live performances.' },
    includes: { uz: ['4 ta sahna moduli', 'Podium', 'Qora sahna qoplamasi'], ru: ['4 сценических модуля', 'Трибуна', 'Чёрное сценическое покрытие'], en: ['4 stage modules', 'Lectern', 'Black stage skirt'] },
  },
  {
    id: 'garden-tent', category: 'furniture', icon: '⛺', art: 'art-sky', price: 650000, rating: 4.8, reviews: 14, stock: 3, featured: false, badge: 'new', vendorName: 'Open Air Co.',
    title: { uz: 'Bog‘ uchun soyabon chodir', ru: 'Тент для сада и открытых площадок', en: 'Garden event canopy' },
    description: { uz: 'Ochiq havodagi tadbirlar uchun quyosh va yengil yomg‘irdan himoya qiladigan keng chodir.', ru: 'Просторный тент для защиты от солнца и лёгкого дождя на мероприятиях под открытым небом.', en: 'A spacious canopy that keeps guests shaded and comfortable at outdoor events.' },
    includes: { uz: ['6 × 4 metrli chodir', 'Metall karkas', 'Yon pardalar'], ru: ['Тент 6 × 4 метра', 'Металлический каркас', 'Боковые шторы'], en: ['6 × 4 m canopy', 'Metal frame', 'Side curtains'] },
  },
  {
    id: 'projector-kit', category: 'audio', icon: '📽️', art: 'art-navy', price: 280000, rating: 4.8, reviews: 23, stock: 6, featured: false, badge: '', vendorName: 'Visual Pro',
    title: { uz: 'Proyektor va katta ekran', ru: 'Проектор и большой экран', en: 'Projector & large screen' },
    description: { uz: 'Taqdimot, kino kechasi yoki muhim daqiqalarni katta ekranda namoyish etish uchun.', ru: 'Для презентаций, кинопоказов и важных моментов на большом экране.', en: 'For presentations, movie nights, and sharing special moments on a big screen.' },
    includes: { uz: ['Full HD proyektor', '120 dyuymli ekran', 'HDMI va quvvat kabellari'], ru: ['Full HD проектор', 'Экран 120 дюймов', 'HDMI-кабели и питание'], en: ['Full HD projector', '120-inch screen', 'HDMI and power cables'] },
  },
  {
    id: 'welcome-bar', category: 'catering', icon: '🥂', art: 'art-mint', price: 360000, rating: 4.9, reviews: 25, stock: 4, featured: true, badge: '', vendorName: 'Welcome Bar',
    title: { uz: 'Mehmon kutib olish burchagi', ru: 'Зона приветственных напитков', en: 'Welcome drinks station' },
    description: { uz: 'Mehmonlar uchun chiroyli bezatilgan, alkogolsiz ichimlik va stakanlari bor burchak.', ru: 'Оформленная зона с безалкогольными напитками и бокалами для ваших гостей.', en: 'A styled station with non-alcoholic drinks and glassware for your guests.' },
    includes: { uz: ['Ichimliklar stendi', '30 ta stakan', 'Sovutilgan ichimliklar'], ru: ['Стойка для напитков', '30 бокалов', 'Охлаждённые напитки'], en: ['Drinks station', '30 glasses', 'Chilled non-alcoholic drinks'] },
  },
];

export function getDefaultDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function getToday() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}
