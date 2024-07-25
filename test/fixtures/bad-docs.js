// @ts-check
import { randomBytes } from 'node:crypto'
import { cachedValues } from './cached.js'

export const badDocs = [
  {
    text: 'test encoding of record with missing fields',
    doc: { docId: randomBytes(32).toString('hex') },
  },
  {
    text: 'test encoding of wrong schema name',
    /** @type Omit<import('../../dist/index.js').Observation, 'schemaName'> & { schemaName: string }} */
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'observOtion',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      createdBy: cachedValues.createdBy,
      links: [],
      attachments: [],
      tags: {},
      metadata: {},
      deleted: false,
    },
  },
  {
    text: 'role doc with empty roleId',
    /** @type {import('../../dist/index.js').Role} */
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'role',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      createdBy: cachedValues.createdBy,
      links: [],
      roleId: '',
      fromIndex: 4,
      deleted: false,
    },
  },
  {
    text: 'icon without name',
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'icon',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      createdBy: cachedValues.createdBy,
      links: [],
      deleted: false,
      variants: [
        {
          size: 'large',
          pixelDensity: 3,
          mimeType: 'image/png',
          blobVersionId: 'someRandomString',
        },
      ],
    },
  },
  {
    text: 'preset with invalid color string',
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'preset',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      createdBy: cachedValues.createdBy,
      links: [],
      name: 'myPreset',
      geometry: ['point'],
      tags: {},
      addTags: {},
      removeTags: {},
      fieldIds: [],
      terms: [],
      deleted: false,
      color: '#ff00g1',
    },
  },
  {
    text: 'preset that references an invalid docTypr',
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'preset',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      createdBy: cachedValues.createdBy,
      links: [],
      name: 'myPreset',
      geometry: ['point'],
      tags: {},
      addTags: {},
      removeTags: {},
      terms: [],
      refs: [
        {
          docId: cachedValues.refs.docId,
          versionId: cachedValues.refs.docId,
          type: 'observation',
        },
      ],
      deleted: false,
      color: '#ff00g1',
    },
  },
  {
    text: 'preset ref type refers to invalid docType',
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'preset',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      createdBy: cachedValues.createdBy,
      links: [],
      name: 'myPreset',
      geometry: ['point', 'vertex', 'line'],
      tags: {
        someKeyForArrVal: ['arr', 'of', 'strings'],
      },
      addTags: {
        heyAddThisTag: 'pleease',
        orMaybeThis: ['right?', '', 'that was empty'],
      },
      removeTags: {
        deleteInmeditaly: ['this list', 'of things'],
      },
      refs: [
        {
          docId: cachedValues.refs.docId,
          versionId: cachedValues.refs.versionId,
          type: 'observation',
        },
      ],
      color: '#ff00ff',
      terms: ['imastring'],
      deleted: false,
    },
  },
  {
    text: 'preset ref type cant refer to itself',
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'preset',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      createdBy: cachedValues.createdBy,
      links: [],
      name: 'myPreset',
      geometry: ['point', 'vertex', 'line'],
      tags: {
        someKeyForArrVal: ['arr', 'of', 'strings'],
      },
      addTags: {
        heyAddThisTag: 'pleease',
        orMaybeThis: ['right?', '', 'that was empty'],
      },
      removeTags: {
        deleteInmeditaly: ['this list', 'of things'],
      },
      refs: [
        {
          docId: cachedValues.refs.docId,
          versionId: cachedValues.refs.versionId,
          type: 'preset',
        },
      ],
      color: '#ff00ff',
      terms: ['imastring'],
      deleted: false,
    },
  },
  {
    text: 'track ref type can only refer to observations',
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'track',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      createdBy: cachedValues.createdBy,
      links: [],
      deleted: false,
      locations: [
        {
          timestamp: cachedValues.metadata.position.timestamp,
          mocked: false,
          coords: { latitude: 12, longitude: 34 },
        },
        {
          timestamp: cachedValues.metadata.position.timestamp,
          mocked: true,
          coords: {
            latitude: 12,
            longitude: 34,
            altitude: 123,
            heading: 123,
            speed: 0.123,
            accuracy: 123,
          },
        },
      ],
      refs: [
        {
          docId: randomBytes(32).toString('hex'),
          versionId: randomBytes(32).toString('hex'),
          type: 'observation',
        },
        {
          docId: randomBytes(32).toString('hex'),
          versionId: randomBytes(32).toString('hex'),
          type: 'field',
        },
      ],
      attachments: [
        {
          name: 'myFile',
          type: 'photo',
          driveDiscoveryId: cachedValues.attachments.driveDiscoveryId,
          hash: cachedValues.attachments.hash,
        },
      ],
      tags: {
        someKeyForArrVal: ['arr', 'of', 'strings'],
      },
    },
  },
]
