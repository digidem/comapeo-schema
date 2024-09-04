// @ts-check
import { cachedValues } from './cached.js'
import { randomBytes } from 'node:crypto'

/**
 * The `expected` is a partial doc of the extra fields that we expect to be set
 * by the encode/decode round-trip
 *
 * @type {Array<{
 *   expected: Partial<import('../../dist/types').MapeoDoc>,
 *   doc: import('../../dist/types').MapeoDocDecode
 * }>}
 */
export const goodDocsMinimal = [
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      originalVersionId: cachedValues.originalVersionId,
      schemaName: 'observation',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      links: [],
      lat: 24.0424,
      lon: 21.0214,
      attachments: [],
      tags: {},
      metadata: { manualLocation: false },
      deleted: false,
    },
    expected: {},
  },
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      originalVersionId: cachedValues.originalVersionId,
      schemaName: 'projectSettings',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      configMetadata: {
        name: 'mapeo-config',
        fileVersion: '1.0',
        buildDate: cachedValues.configMetadata.buildDate,
        importDate: cachedValues.configMetadata.importDate,
      },
      links: [],
      deleted: false,
      isInitialProject: false,
    },
    expected: {},
  },
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      originalVersionId: cachedValues.originalVersionId,
      schemaName: 'field',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      links: [],
      tagKey: 'myTagKey',
      label: 'my label',
      type: 'text',
      deleted: false,
      universal: false,
    },
    expected: {},
  },
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      originalVersionId: cachedValues.originalVersionId,
      schemaName: 'preset',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      links: [],
      name: 'myPreset',
      geometry: ['point'],
      tags: {},
      addTags: {},
      removeTags: {},
      fieldRefs: [],
      iconRef: {
        docId: cachedValues.refs.docId,
        versionId: cachedValues.refs.versionId,
      },
      terms: [],
      deleted: false,
      color: '#ff00ff',
    },
    expected: {},
  },
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      originalVersionId: cachedValues.originalVersionId,
      schemaName: 'role',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      links: [],
      roleId: '3b0104e370f9',
      fromIndex: 5,
      deleted: false,
    },
    expected: {},
  },
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      originalVersionId: cachedValues.originalVersionId,
      schemaName: 'deviceInfo',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      links: [],
      name: 'my device name',
      deleted: false,
    },
    expected: {},
  },
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      originalVersionId: cachedValues.originalVersionId,
      schemaName: 'coreOwnership',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      links: [],
      authCoreId: Buffer.from('authCoreId').toString('hex'),
      configCoreId: Buffer.from('configCoreId').toString('hex'),
      dataCoreId: Buffer.from('dataCoreId').toString('hex'),
      blobCoreId: Buffer.from('blobCoreId').toString('hex'),
      blobIndexCoreId: Buffer.from('blobIndexCoreId').toString('hex'),
      coreSignatures: {
        auth: Buffer.from('auth'),
        config: Buffer.from('config'),
        data: Buffer.from('data'),
        blob: Buffer.from('blob'),
        blobIndex: Buffer.from('blobIndex'),
      },
      identitySignature: Buffer.from('identity'),
      deleted: true,
    },
    expected: {},
  },
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      originalVersionId: cachedValues.originalVersionId,
      schemaName: 'icon',
      name: 'tree',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      links: [],
      deleted: false,
      variants: [
        {
          size: 'small',
          pixelDensity: 1,
          blobVersionId: randomBytes(32).toString('hex') + '/0',
          mimeType: 'image/png',
        },
      ],
    },
    expected: {},
  },
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      originalVersionId: cachedValues.originalVersionId,
      schemaName: 'translation',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      links: [],
      deleted: false,
      docRef: {
        docId: cachedValues.refs.docId,
        versionId: cachedValues.refs.versionId,
      },
      docRefType: 'field',
      propertyRef: 'label',
      languageCode: 'qu',
      regionCode: 'PE',
      message: `sach'a`,
    },
    expected: {},
  },
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      originalVersionId: cachedValues.originalVersionId,
      schemaName: 'track',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      links: [],
      deleted: false,
      locations: [],
      observationRefs: [],
      tags: {},
    },
    expected: {},
  },
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      originalVersionId: cachedValues.originalVersionId,
      schemaName: 'remoteDetectionAlert',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      links: [],
      deleted: false,
      sourceId: '',
      detectionDateStart: cachedValues.createdAt,
      detectionDateEnd: cachedValues.updatedAt,
      geometry: {},
      metadata: {},
    },
    expected: {},
  },
]
