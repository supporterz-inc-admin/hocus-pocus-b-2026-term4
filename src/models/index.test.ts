import { readdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const modelsDir = dirname(fileURLToPath(import.meta.url));
const models = readdirSync(modelsDir).filter((model) => model.endsWith('.model.ts'));

describe('Model と Test が 1:1 に対応すること', () => {
  it.each(models)('%s に対応する Test が存在する', (model) => {
    const test = model.replace(/\.model\.ts$/, '.model.test.ts');

    expect(readdirSync(modelsDir), `${test} が存在しません`).toContain(test);
  });
});
