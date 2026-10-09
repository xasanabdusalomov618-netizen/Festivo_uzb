import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { languages, translations, translate } from '../src/i18n.js';
import { categories, eventTypes, seedProducts } from '../src/data.js';

const expectedLanguages = ['uz', 'ru', 'en'];

test('all three interface dictionaries have the same complete key set', () => {
  assert.deepEqual(languages.map(({ code }) => code), expectedLanguages);
  const keys = Object.keys(translations.uz).sort();
  for (const language of expectedLanguages) {
    assert.deepEqual(Object.keys(translations[language]).sort(), keys, `incomplete ${language} dictionary`);
    for (const key of keys) {
      assert.ok(translations[language][key], `${language} is missing ${key}`);
      assert.notEqual(translations[language][key], key, `${language} exposes key ${key}`);
    }
  }
});

test('brand headline and requested language examples are exact', () => {
  assert.equal(translations.uz['hero.title'], "TADBIRINGIZNI 10 DAQIQADA YIG'ING");
  assert.equal(translations.ru['hero.title'], 'ОРГАНИЗУЙТЕ МЕРОПРИЯТИЕ ЗА 10 МИНУТ');
  assert.equal(translations.en['hero.title'], 'PLAN YOUR EVENT IN 10 MINUTES');
  assert.equal(translations.uz['nav.home'], 'Bosh sahifa');
  assert.equal(translations.uz['hero.primaryCta'], "Jihozlarni ko'rish");
  assert.equal(translations.uz['hero.secondaryCta'], 'Tadbirni rejalashtirish');
  assert.equal(translations.uz['nav.bookings'], 'Buyurtmalarim');
  assert.equal(translations.uz['common.delivery'], 'Yetkazib berish');
  assert.equal(translations.uz['product.addCart'], "Savatga qo'shish");
  assert.equal(translations.ru['nav.home'], 'Главная');
  assert.equal(translations.ru['hero.primaryCta'], 'Посмотреть оборудование');
  assert.equal(translations.ru['hero.secondaryCta'], 'Планировать мероприятие');
  assert.equal(translations.ru['nav.bookings'], 'Мои заказы');
  assert.equal(translations.ru['common.delivery'], 'Доставка');
  assert.equal(translations.ru['product.addCart'], 'Добавить в корзину');
  assert.equal(translations.en['nav.home'], 'Home');
  assert.equal(translations.en['hero.primaryCta'], 'Browse Equipment');
  assert.equal(translations.en['hero.secondaryCta'], 'Plan an Event');
  assert.equal(translations.en['nav.bookings'], 'My Bookings');
  assert.equal(translations.en['common.delivery'], 'Delivery');
  assert.equal(translations.en['product.addCart'], 'Add to Cart');
});

test('application translation calls do not reference missing dictionary keys', async () => {
  const source = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  const referenced = new Set([...source.matchAll(/\bt\(['"]([^'"]+)['"]/g)].map((match) => match[1]));
  for (const key of referenced) assert.ok(translations.uz[key], `missing static key: ${key}`);
  for (const prefix of ['category', 'planner', 'services', 'status']) {
    assert.ok(Object.keys(translations.uz).some((key) => key.startsWith(`${prefix}.`)), `missing ${prefix} translations`);
  }
  assert.equal(translate('en', 'account.welcome', { name: 'Sam' }), 'Welcome, Sam!');
});

test('dynamic category, event, service, and booking-status keys are translated', () => {
  const dynamicKeys = [
    ...categories.map(({ id }) => `category.${id}`),
    ...eventTypes.map(({ id }) => `planner.${id}`),
    ...['delivery', 'install', 'support'].flatMap((key) => [`services.${key}Title`, `services.${key}Text`]),
    ...['pending', 'confirmed', 'preparing', 'delivered', 'completed', 'cancelled'].map((status) => `status.${status}`),
    'product.tagNew', 'product.tagPopular',
  ];
  for (const language of expectedLanguages) {
    for (const key of dynamicKeys) assert.ok(translations[language][key], `${language} is missing dynamic key ${key}`);
  }
  assert.equal(translate('en', 'missing.translation.key'), '');
});

test('seed product content is localized in Uzbek, Russian, and English', () => {
  for (const product of seedProducts) {
    for (const field of ['title', 'description', 'includes']) {
      for (const language of expectedLanguages) {
        assert.ok(product[field]?.[language], `${product.id} is missing ${field}.${language}`);
      }
    }
  }
});
