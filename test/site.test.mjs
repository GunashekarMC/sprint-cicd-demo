import test from 'node:test';
import assert from 'node:assert/strict';
import { siteTitle, releaseLabel } from '../src/config.mjs';

test('demo page has a recognizable Sprint title', () => {
  assert.match(siteTitle, /Sprint/);
});

test('release label is set', () => {
  assert.ok(releaseLabel.trim().length > 0, 'releaseLabel must not be empty');
});
