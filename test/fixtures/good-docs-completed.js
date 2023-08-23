// @ts-check

import { cachedValues } from './cached.js'

/**
 * @type {Array<{
 *   expected: Partial<import('../../dist/types').MapeoDoc>,
 *   doc: import('../../dist/types').MapeoDoc
 * }>}
 */
export const goodDocsCompleted = [
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'observation',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      links: [],
      lat: 24.0424,
      lon: 21.0214,
      refs: [],
      attachments: [
        {
          name: 'myFile',
          type: 'photo',
          driveId: cachedValues.attachments.driveId,
        },
      ],
      tags: {
        someKeyForSingleVal: 'someVal',
        someKeyForArrVal: ['arr', 'of', 'strings'],
      },
      metadata: {
        manualLocation: true,
        position: {
          timestamp: cachedValues.metadata.position.timestamp,
          mocked: false,
          coords: {
            latitude: 0.5,
            longitude: -0.2,
            altitude: 0.8,
            heading: 1.2,
            speed: 0.7,
            accuracy: 1.3,
          },
        },
        lastSavedPosition: {
          timestamp: cachedValues.metadata.position.timestamp,
          mocked: true,
          coords: {
            latitude: 1.5,
            longitude: -2.3,
            altitude: 1000.1,
            heading: 0.2,
            speed: 0.1,
            accuracy: 8.3,
          },
        },
        positionProvider: {
          gpsAvailable: true,
          passiveAvailable: false,
          locationServicesEnabled: true,
          networkAvailable: false,
        },
      },
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
      defaultPresets: {
        point: cachedValues.defaultPresets.point,
        area: cachedValues.defaultPresets.point,
        vertex: cachedValues.defaultPresets.point,
        line: cachedValues.defaultPresets.point,
        relation: cachedValues.defaultPresets.point,
      },
      name: 'myProject',
    },
    expected: {},
  },
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'field',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      links: [],
      tagKey: 'otherTagKey',
      type: 'number',
      label: 'differentLabel',
      appearance: 'singleline',
      snakeCase: true,
      universal: true,
      options: [
        {
          label: 'someOtherLabel',
          value: 'somePrimitiveTagValue',
        },
      ],
    },
    expected: {},
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
      fieldIds: cachedValues.fieldIds,
      iconId: cachedValues.iconId,
      terms: ['imastring'],
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
      roleId: '6fd029a78243',
      fromIndex: 5,
    },
    expected: {},
  },
  {
    doc: {
      docId: cachedValues.docId,
      versionId: cachedValues.versionId,
      schemaName: 'deviceInfo',
      createdAt: cachedValues.createdAt,
      updatedAt: cachedValues.updatedAt,
      links: [],
      name: 'my device name',
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
      authorIndex: 100,
      deviceIndex: 2,
      authorId: cachedValues.authorId,
      capabilityType: 'someCapability',
    },
    expected: {},
  },
]
