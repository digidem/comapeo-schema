import { randomBytes } from 'node:crypto'

export const docs = {
  onlyId: { id: randomBytes(32).toString('hex') },
  badDocType: {
    id: randomBytes(32).toString('hex'),
    schemaType: 'doesnotexist',
    schemaVersion: 4,
    links: [],
    createdAt: new Date().toJSON(),
    refs: [],
    attachments: [],
    metadata: {
      manual_location: true,
    },
  },
  badSchemaVersion: {
    id: randomBytes(32).toString('hex'),
    schemaType: 'observation',
    schemaVersion: null,
    links: [],
    createdAt: new Date().toJSON(),
    refs: [],
    attachments: [],
    metadata: {
      manual_location: true,
    },
  },
  good: {
    observation_4: {
      id: randomBytes(32).toString('hex'),
      schemaType: 'observation',
      schemaVersion: 4,
      links: [],
      createdAt: new Date().toJSON(),
      updatedAt: new Date().toJSON(),
      refs: [],
      attachments: [],
      metadata: {
        manual_location: true,
      },
    },
    observation_5: {
      id: randomBytes(32).toString('hex'),
      schemaType: 'Observation',
      createdAt: new Date().toJSON(),
      updatedAt: new Date().toJSON(),
      links: ['a498daf102']
    },
    filter: {
      id: randomBytes(32).toString('hex'),
      updatedAt: new Date().toJSON(),
      schemaType: 'filter',
      schemaVersion: 1,
      createdAt: new Date().toJSON(),
      filter: ['observation'],
      name: 'john',
    },
    preset: {
      id: randomBytes(32).toString('hex'),
      schemaType: 'Preset',
      schemaVersion: 1,
      tags: { nature: 'tree' },
      geometry: ['point'],
      name: 'john',
    },
    field: {
      id: randomBytes(32).toString('hex'),
      schemaType: 'Field',
      schemaVersion: 1,
      key: 'hi',
      type: 'text',
    },
    coreOwnership: {
      schemaType: 'coreOwnership',
      schemaVersion: 1,
      id: randomBytes(32).toString('hex'),
      coreId: randomBytes(32).toString('hex'),
      projectId: randomBytes(32).toString('hex'),
      storeType: 'blob',
      authorIndex: 10,
      deviceIndex: 10,
      action: 'core:owner',
      createdAt: new Date().toJSON(),
      updatedAt: new Date().toJSON(),
    },
    device: {
      schemaType: 'Device',
      schemaVersion: 1,
      id: randomBytes(32).toString('hex'),
      action: 'device:add',
      authorId: randomBytes(32).toString('hex'),
      projectId: randomBytes(32).toString('hex'),
      signature: 'hi',
      authorIndex: 10,
      deviceIndex: 10,
      createdAt: new Date().toJSON(),
      updatedAt: new Date().toJSON(),
    },
    role: {
      id: randomBytes(32).toString('hex'),
      schemaType: 'Role',
      schemaVersion: 1,
      role: 'project-creator',
      projectId: randomBytes(32).toString('hex'),
      action: 'role:set',
      signature: 'hi',
      authorIndex: 10,
      deviceIndex: 10,
      createdAt: new Date().toJSON(),
      updatedAt: new Date().toJSON(),
    },
  },
}
// Object.keys(docs).forEach(save)
