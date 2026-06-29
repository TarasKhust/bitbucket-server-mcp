import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildResolveCommentBody,
  buildSuggestedChangeText,
  formatPullRequestComment,
} from '../dist/tools/comments.js'

test('buildResolveCommentBody sets threadResolved with the current version', () => {
  assert.deepEqual(buildResolveCommentBody({ version: 7 }), {
    version: 7,
    threadResolved: true,
  })

  assert.deepEqual(buildResolveCommentBody({ version: 7 }, false, 8), {
    version: 8,
    threadResolved: false,
  })
})

test('buildSuggestedChangeText wraps replacement code in a suggestion block', () => {
  assert.equal(
    buildSuggestedChangeText(
      "const data = await apiRequest('GET', '/components/')",
      'Suggested simplification:'
    ),
    [
      'Suggested simplification:',
      '',
      '```suggestion',
      "const data = await apiRequest('GET', '/components/')",
      '```',
    ].join('\n')
  )
})

test('buildSuggestedChangeText rejects nested code fences', () => {
  assert.throws(
    () => buildSuggestedChangeText('```ts\nconst value = true\n```'),
    /triple backticks/
  )
})

test('formatPullRequestComment includes nested replies', () => {
  const formatted = formatPullRequestComment({
    id: 5958318,
    text: 'Move label to props',
    createdDate: 1778736786586,
    updatedDate: 1778736786586,
    author: {
      displayName: 'Reviewer',
    },
    comments: [
      {
        id: 5958521,
        text: 'Fixed',
        createdDate: 1778745662426,
        updatedDate: 1778745662426,
        author: {
          displayName: 'Author',
        },
        comments: [],
        anchor: {
          path: 'packages/ui-kit/src/components/StepIndicator/StepIndicator.tsx',
          line: 97,
          lineType: 'ADDED',
          orphaned: true,
        },
        threadResolved: false,
        state: 'OPEN',
      },
    ],
    anchor: {
      path: 'packages/ui-kit/src/components/StepIndicator/StepIndicator.tsx',
      line: 97,
      lineType: 'ADDED',
      orphaned: true,
    },
    threadResolved: false,
    state: 'OPEN',
  })

  assert.equal(formatted.id, 5958318)
  assert.equal(formatted.replies.length, 1)
  assert.deepEqual(formatted.replies[0], {
    id: 5958521,
    parentId: 5958318,
    author: 'Author',
    text: 'Fixed',
    createdDate: '2026-05-14T08:01:02.426Z',
    updatedDate: '2026-05-14T08:01:02.426Z',
    threadResolved: false,
    state: 'OPEN',
    anchor: {
      path: 'packages/ui-kit/src/components/StepIndicator/StepIndicator.tsx',
      line: 97,
      lineType: 'ADDED',
      orphaned: true,
    },
    replies: [],
  })
})
