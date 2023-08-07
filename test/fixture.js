import { randomBytes } from 'node:crypto'

export const fixtures = {
  onlyId: {
    text: 'test encoding of record with missing fields',
    plan: 1,
    doc: {id: randomBytes(32).toString('hex')}
  },
  badDocName: {
    text: 'test encoding of wrong record type',
    plan: 1,
    doc: {
      id: randomBytes(32).toString('hex'),
      schemaName: 'doesnotexist',
      links: [],
      createdAt: new Date().toJSON(),
      refs: [],
      attachments: [],
      metadata: {
        manual_location: true,
      },
    }
  },
  goodDocs:{
    text: 'test encoding of rightfully formated records',
    plan: 1,
    docs: {
      observation:{
        docId: randomBytes(32).toString('hex'),
        versionId: `${randomBytes(32).toString('hex')}/0`,
        schemaName: 'observation',
        createdAt: new Date().toJSON(),
        updatedAt: new Date().toJSON(),
        links: [],
        lat: 10,
        lon: -20.3,
        refs: [],
        attachments: [],
        metadata: {
          manualLocation: true,
        },
        tags: {}
      },
      project: {
        docId: randomBytes(32).toString('hex'),
        versionId: `${randomBytes(32).toString('hex')}/0`,
        schemaName: 'project',
        createdAt: new Date().toJSON(),
        updatedAt: new Date().toJSON(),
        links: [],
        name: 'myProject',
        defaultPresets: {
          point: ["myPointPreset"],
          vertex: ["myVertexPreset"],
          area: ["myAreaPreset"],
          line: ["myLinePreset"],
          relation: ["myRelationPreset"],
        }
      },
      field: {
        docId: randomBytes(32).toString('hex'),
        versionId: `${randomBytes(32).toString('hex')}/0`,
        schemaName: 'field',
        createdAt: new Date().toJSON(),
        updatedAt: new Date().toJSON(),
        links: [],
        tagKey: "myTagKey",
        type: "text",
        label: "myLabel"
      },
      preset: {
        docId: randomBytes(32).toString('hex'),
        versionId: `${randomBytes(32).toString('hex')}/0`,
        schemaName: 'preset',
        createdAt: new Date().toJSON(),
        updatedAt: new Date().toJSON(),
        links: [],
        name:"myPreset",
        geometry:["point"],
        tags:{},
        addTags:{},
        removeTags:{},
        fieldIds:[],
        terms:[]
      },
      role: {
        docId: randomBytes(32).toString('hex'),
        versionId: `${randomBytes(32).toString('hex')}/0`,
        schemaName: 'role',
        createdAt: new Date().toJSON(),
        updatedAt: new Date().toJSON(),
        links: [],
        role:"author",
        projectId:randomBytes(32).toString('hex'),
        action:"role_set",
        signature:"signature",
        authorIndex:2,
        deviceIndex:4,
        authorId:randomBytes(32).toString('hex'),
        capabilityType:"capability"
      },
      device: {
        docId: randomBytes(32).toString('hex'),
        versionId: `${randomBytes(32).toString('hex')}/0`,
        schemaName: 'device',
        createdAt: new Date().toJSON(),
        updatedAt: new Date().toJSON(),
        links: [],
        action:"ban",
        authorId:randomBytes(32).toString('hex'),
        projectId:randomBytes(32).toString('hex'),
        signature:"mySignature",
        authorIndex:2,
        deviceIndex:20,
        capabilityType:"someCapability",
      },
      coreOwnership: {
        docId: randomBytes(32).toString('hex'),
        versionId: `${randomBytes(32).toString('hex')}/0`,
        schemaName: 'coreOwnership',
        createdAt: new Date().toJSON(),
        updatedAt: new Date().toJSON(),
        links: [],
        action:"remove",
        coreId:randomBytes(32).toString('hex'),
        projectId:randomBytes(32).toString('hex'),
        storeType:"blob",
        signature:"mySig",
        authorIndex: 10,
        deviceIndex: 9,
        authorId:randomBytes(32).toString('hex'),
        capabilityType: "someCapability"
      }
    }
  }
}
