import test from 'ava';

import { CORRECT } from './correctResult';
import { categoryTree } from './task';

test('categoryTree should return correct result', async (t) => {
  const result = await categoryTree();
  t.deepEqual(result, CORRECT);
});
