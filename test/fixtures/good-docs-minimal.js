// @ts-check
import { cachedValues } from './cached.js'

/**
 * The `expected` is a partial doc of the extra fields that we expect to be set
 * by the encode/decode round-trip
 *
 * @type {Array<{
 *   expected: Partial<import('../../dist/types').MapeoDoc>,
 *   doc: import('../../dist/types').MapeoDoc
 * }>}
 */
export const goodDocsMinimal = [
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'observation',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      links: [],
      refs: [],
      attachments: [],
      tags: {},
      metadata: {},
    },
    expected: {},
  },
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'project',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      links: [],
      defaultPresets: {},
      name: 'myProject',
    },
    expected: {
      defaultPresets: {
        point: [],
        area: [],
        vertex: [],
        line: [],
        relation: [],
      },
    },
  },
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'field',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      links: [],
      tagKey: 'myTagKey',
      label: 'my label',
      type: 'text',
    },
    expected: {
      appearance: 'multiline',
      snakeCase: false,
      options: [],
      universal: false,
    },
  },
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'preset',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      links: [],
      name: 'myPreset',
      geometry: ['point'],
      tags: {},
      addTags: {},
      removeTags: {},
      fieldIds: [],
      terms: [],
    },
    expected: {},
  },
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'role',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      links: [],
      role: 'author',
      projectId: cachedValues.projectId,
      signature: 'signature',
      authorId: cachedValues.authorId,
      capabilityType: 'capability',
      authorIndex: 0,
      deviceIndex: 0,
      action: 'UNRECOGNIZED',
    },
    expected: {},
  },
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'device',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      links: [],
      action: 'ban',
      authorId: cachedValues.authorId,
      projectId: cachedValues.projectId,
      signature: 'mySignature',
      capabilityType: 'someCapability',
      authorIndex: 0,
      deviceIndex: 0,
    },
    expected: {},
  },
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'coreOwnership',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      links: [],
      action: 'remove',
      coreId: cachedValues.coreId,
      projectId: cachedValues.projectId,
      storeType: 'blob',
      signature: 'mySig',
      authorId: cachedValues.authorId,
      capabilityType: 'someCapability',
      authorIndex: 0,
      deviceIndex: 0,
    },
    expected: {},
  },
]
