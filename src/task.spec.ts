import test from 'ava';

import { CORRECT } from './correctResult';
import { INPUT } from './input';
import {
  categoryTree,
  getTitleNumber,
  setShowOnHome,
  sortByOrder,
} from './task';

const categoryListElement = {
  id: 1,
  order: 1,
  name: 'name',
  image: 'image',
  showOnHome: false,
  children: [],
};

test('categoryTree should return correct result', async (t) => {
  const result = await categoryTree(() => Promise.resolve({ data: INPUT }));
  t.deepEqual(result, CORRECT);
});

test('if data = [], categoryTree should return an empty array', async (t) => {
  const result = await categoryTree(() => Promise.resolve({ data: [] }));
  t.deepEqual(result, []);
});

test('if data = undefined, categoryTree should return an empty array', async (t) => {
  const result = await categoryTree(() =>
    Promise.resolve({ data: undefined } as never)
  );
  t.deepEqual(result, []);
});

test('if error occurs, categoryTree should return empty array', async (t) => {
  const result = await categoryTree(() => Promise.reject(new Error()));
  t.deepEqual(result, []);
});

test('getTitleNumber should return correct result', (t) => {
  t.is(getTitleNumber('ab'), null);
  t.is(getTitleNumber('#'), null);
  t.is(getTitleNumber('3'), 3);
  t.is(getTitleNumber('4#'), 4);
});

test('sortByOrder should return correct result', (t) => {
  t.is(
    sortByOrder(
      { ...categoryListElement, order: 1 },
      { ...categoryListElement, order: 2 }
    ),
    -1
  );

  t.is(
    sortByOrder(
      { ...categoryListElement, order: 2 },
      { ...categoryListElement, order: 1 }
    ),
    1
  );

  t.is(
    sortByOrder(
      { ...categoryListElement, order: 1 },
      { ...categoryListElement, order: 1 }
    ),
    0
  );
});

test('for less than 5 categories setShowOnHome should return correct result', (t) => {
  const categories = [{ ...categoryListElement, order: 1 }];

  const result = setShowOnHome(categories);
  t.deepEqual(result, [{ ...categoryListElement, order: 1, showOnHome: true }]);
});

test('if some category showOnHome true, setShowOnHome should return correct result', (t) => {
  const categories = Array.from({ length: 6 }, (_, i) => ({
    ...categoryListElement,
    showOnHome: i === 0,
    order: i + 1,
  }));

  const result = setShowOnHome(categories);
  t.deepEqual(result, categories);
});

test('for more than 5 categories setShowOnHome should return correct result', (t) => {
  const categories = Array.from({ length: 6 }, (_, i) => ({
    ...categoryListElement,
    order: i + 1,
  }));

  const result = setShowOnHome(categories);
  t.deepEqual(result, [
    { ...categoryListElement, order: 1, showOnHome: true },
    { ...categoryListElement, order: 2, showOnHome: true },
    { ...categoryListElement, order: 3, showOnHome: true },
    { ...categoryListElement, order: 4, showOnHome: false },
    { ...categoryListElement, order: 5, showOnHome: false },
    { ...categoryListElement, order: 6, showOnHome: false },
  ]);
});
