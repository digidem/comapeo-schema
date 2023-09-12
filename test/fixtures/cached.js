import { randomBytes } from 'node:crypto'

// For stuff like dates or generated random Ids, so I can compare with an expected doc
const date = new Date().toJSON()
export const cachedValues = {
  docId: randomBytes(32).toString('hex'),
  versionId: `${randomBytes(32).toString('hex')}/0`,
  projectId: randomBytes(32).toString('hex'),
  authorId: randomBytes(32).toString('hex'),
  coreId: randomBytes(32).toString('hex'),
  createdBy: randomBytes(32).toString('hex'),
  createdAt: date,
  updatedAt: date,
  attachments: { driveId: randomBytes(32).toString('hex') },
  metadata: {
    position: {
      timestamp: date,
    },
  },
  defaultPresets: {
    point: [randomBytes(32).toString('hex')],
    area: [randomBytes(32).toString('hex')],
    vertex: [randomBytes(32).toString('hex')],
    line: [randomBytes(32).toString('hex')],
    relation: [randomBytes(32).toString('hex')],
  },
  fieldIds: [randomBytes(32).toString('hex')],
  iconId: randomBytes(32).toString('hex'),
}
