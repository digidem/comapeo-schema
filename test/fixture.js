import { randomBytes } from 'node:crypto'
import { cachedDataVersionTag } from 'node:v8'

// For stuff like dates or generated random Ids, so I can compare with an expected doc
const date =  new Date().toJSON()
const cachedValues = {
  docId: randomBytes(32).toString('hex'),
  versionId:`${randomBytes(32).toString('hex')}/0`,
  projectId: randomBytes(32).toString('hex'),
  authorId: randomBytes(32).toString('hex'),
  coreId: randomBytes(32).toString('hex'),
  createdAt: date,
  updatedAt: date,
  attachments: {driveId: randomBytes(32).toString('hex')},
  metadata: {
    position: {
      timestamp: date
    }
  },
  defaultPresets: {
    point: [randomBytes(32).toString('hex')],
    area: [randomBytes(32).toString('hex')],
    vertex: [randomBytes(32).toString('hex')],
    line: [randomBytes(32).toString('hex')],
    relation: [randomBytes(32).toString('hex')],
  },
  fieldIds: [randomBytes(32).toString('hex')],
  iconId: randomBytes(32).toString('hex')
}

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
  /** @type {Array<{
   * expected:import('../dist/types').MapeoDoc,
   * doc: import('../dist/types').MapeoDoc}>
   * } */
  goodDocsMinimal:[
    {
      doc:{
        docId: cachedValues.docId,
        versionId: cachedValues.versionId,
        schemaName: 'observation',
        createdAt: cachedValues.createdAt,
        updatedAt: cachedValues.updatedAt,
        links: [],
        refs: [],
        attachments: [],
        tags: {}
      },
      expected:{
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
      }
     },
    {
      doc:{
        docId: cachedValues.docId,
        versionId: cachedValues.versionId,
        schemaName: 'project',
        createdAt: cachedValues.createdAt,
        updatedAt: cachedValues.updatedAt,
        links: [],
        defaultPresets: {},
        name: 'myProject'
      },
      expected:{
        docId: cachedValues.docId,
        versionId: cachedValues.versionId,
        schemaName: 'project',
        createdAt: cachedValues.createdAt,
        updatedAt: cachedValues.updatedAt,
        links: [],
        defaultPresets: {point: [], area: [], vertex: [], line: [], relation: []},
        name: 'myProject'
      }
    },
    {
      doc:{
        docId: cachedValues.docId,
        versionId: cachedValues.versionId,
        schemaName: 'field',
        createdAt: cachedValues.createdAt,
        updatedAt: cachedValues.updatedAt,
        links: [],
        tagKey: "myTagKey",
      },
      expected:{
        docId: cachedValues.docId,
        versionId: cachedValues.versionId,
        schemaName: 'field',
        createdAt: cachedValues.createdAt,
        updatedAt: cachedValues.updatedAt,
        links: [],
        tagKey: "myTagKey",
        type: "text",
        label: "myTagKey", // see src/lib/decode-conversions.js:77
        appearance: 'multiline',
        snakeCase: false,
        options: [],
        universal: false,
      }},
    {
      doc:{
        docId: cachedValues.docId,
        versionId: cachedValues.versionId,
        schemaName: 'preset',
        createdAt: cachedValues.createdAt,
        updatedAt: cachedValues.updatedAt,
        links: [],
        name:"myPreset",
        geometry:["point"],
        tags:{},
        addTags:{},
        removeTags:{},
        fieldIds:[],
        terms:[]
      },
      expected:{
        docId: cachedValues.docId,
        versionId: cachedValues.versionId,
        schemaName: 'preset',
        createdAt: cachedValues.createdAt,
        updatedAt: cachedValues.updatedAt,
        links: [],
        name:"myPreset",
        geometry:["point"],
        tags:{},
        addTags:{},
        removeTags:{},
        fieldIds:[],
        terms:[]
      }
    },
    {
      doc:{
        docId: cachedValues.docId,
        versionId: cachedValues.versionId,
        schemaName: 'role',
        createdAt: cachedValues.createdAt,
        updatedAt: cachedValues.updatedAt,
        links: [],
        role:"author",
        projectId: cachedValues.projectId,
        signature:"signature",
        authorId: cachedValues.authorId,
        capabilityType:"capability"
      },
      expected:{
        docId: cachedValues.docId,
        versionId: cachedValues.versionId,
        schemaName: 'role',
        createdAt: cachedValues.createdAt,
        updatedAt: cachedValues.updatedAt,
        links: [],
        role:"author",
        projectId: cachedValues.projectId,
        action: 'UNRECOGNIZED',
        signature:"signature",
        authorIndex:0,
        deviceIndex:0,
        authorId:cachedValues.authorId,
        capabilityType:"capability"
      }
    },
    {
      doc:{
        docId: cachedValues.docId,
        versionId: cachedValues.versionId,
        schemaName: 'device',
        createdAt: cachedValues.createdAt,
        updatedAt: cachedValues.updatedAt,
        links: [],
        action:"ban",
        authorId: cachedValues.authorId,
        projectId: cachedValues.projectId,
        signature:"mySignature",
        capabilityType:"someCapability",
      },
      expected:{
        docId: cachedValues.docId,
        versionId: cachedValues.versionId,
        schemaName: 'device',
        createdAt: cachedValues.createdAt,
        updatedAt: cachedValues.updatedAt,
        links: [],
        action:"ban",
        authorId: cachedValues.authorId,
        projectId: cachedValues.projectId,
        signature:"mySignature",
        authorIndex:0,
        deviceIndex:0,
        capabilityType:"someCapability",
      }
    },
    {
      doc:{
        docId: cachedValues.docId,
        versionId: cachedValues.versionId,
        schemaName: 'coreOwnership',
        createdAt: cachedValues.createdAt,
        updatedAt: cachedValues.updatedAt,
        links: [],
        action:"remove",
        coreId: cachedValues.coreId,
        projectId: cachedValues.projectId,
        storeType:"blob",
        signature:"mySig",
        authorId: cachedValues.authorId,
        capabilityType: "someCapability"
      },
      expected:{
        docId: cachedValues.docId,
        versionId: cachedValues.versionId,
        schemaName: 'coreOwnership',
        createdAt: cachedValues.createdAt,
        updatedAt: cachedValues.updatedAt,
        links: [],
        action:"remove",
        coreId: cachedValues.coreId,
        projectId: cachedValues.projectId,
        storeType:"blob",
        signature:"mySig",
        authorIndex: 0,
        deviceIndex: 0,
        authorId: cachedValues.authorId,
        capabilityType: "someCapability"
      }
    }
  ],
  goodDocsCompleted: [
    {
      doc:{
        docId: cachedValues.docId,
        versionId: cachedValues.versionId,
        schemaName: 'observation',
        createdAt: cachedValues.createdAt,
        updatedAt: cachedValues.updatedAt,
        links: [],
        lat: 24.0424,
        lon: 21.0214,
        refs: [],
        attachments: [{
          name: 'myFile',
          type: 'photo',
          driveId: cachedValues.attachments.driveId
        }],
        tags: {
          someKeyForSingleVal: 'someVal',
          // someKeyForArrVal: ['arr', 'of', 'strings']
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
              acurracy: 1.3
            }
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
              acurracy: 8.3
            }
          },
          positionProvider: {
            gpsAvailable: true,
            passiveAvailable: false,
            locationServicesEnabled: true,
            networkAvailable: false
          }
        }
      },
      expected:{
        docId: cachedValues.docId,
        versionId: cachedValues.versionId,
        schemaName: 'observation',
        createdAt: cachedValues.createdAt,
        updatedAt: cachedValues.updatedAt,
        links: [],
        lat: 24.0424,
        lon: 21.0214,
        refs: [],
        attachments: [{
          name: 'myFile',
          type: 'photo',
          driveId: cachedValues.attachments.driveId
        }],
        tags: {
          someKeyForSingleVal: 'someVal',
          // someKeyForArrVal: ['arr', 'of', 'strings']
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
              acurracy: 1.3
            }
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
              acurracy: 8.3
            }
          },
          positionProvider: {
            gpsAvailable: true,
            passiveAvailable: false,
            locationServicesEnabled: true,
            networkAvailable: false
          }
        },
      }
     },
    {
      doc:{
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
          relation: cachedValues.defaultPresets.point
        },
        name: 'myProject'
      },
      expected:{
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
        name: 'myProject'
      }
    },
    {
      doc:{
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
        options: [{
          label: 'someOtherLabel',
          value: 'somePrimitiveTagValue'
        }],
      },
      expected:{
        docId: cachedValues.docId,
        versionId: cachedValues.versionId,
        schemaName: 'field',
        createdAt: cachedValues.createdAt,
        updatedAt: cachedValues.updatedAt,
        links: [],
        tagKey: "otherTagKey",
        type: "number",
        label: "differentLabel",
        appearance: 'singleline',
        snakeCase: true,
        universal: true,
        options: [{
          label: 'someOtherLabel',
          value: 'somePrimitiveTagValue'
        }],
      }},
    {
      doc:{
        docId: cachedValues.docId,
        versionId: cachedValues.versionId,
        schemaName: 'preset',
        createdAt: cachedValues.createdAt,
        updatedAt: cachedValues.updatedAt,
        links: [],
        name:"myPreset",
        geometry:["point", "vertex", "line"],
        tags: {
          someKeyForArrVal: ['arr', 'of', 'strings']
        },
        addTags:{
          heyAddThisTag: 'pleease'
        },
        removeTags:{
          deleteInmeditaly: ['this list', 'of things']
        },
        fieldIds:cachedValues.fieldIds,
        iconId: cachedValues.iconId,
        terms:["imastring"]
      },
      expected:{
        docId: cachedValues.docId,
        versionId: cachedValues.versionId,
        schemaName: 'preset',
        createdAt: cachedValues.createdAt,
        updatedAt: cachedValues.updatedAt,
        links: [],
        name:"myPreset",
        geometry:["point", "vertex", "line"],
        tags: {
          someKeyForArrVal: ['arr', 'of', 'strings']
        },
        addTags:{
          heyAddThisTag: 'pleease'
        },
        removeTags:{
          deleteInmeditaly: ['this list', 'of things']
        },
        fieldIds:cachedValues.fieldIds,
        iconId: cachedValues.iconId,
        terms:["imastring"]
      }
    },
    {
      doc:{
        docId: cachedValues.docId,
        versionId: cachedValues.versionId,
        schemaName: 'role',
        createdAt: cachedValues.createdAt,
        updatedAt: cachedValues.updatedAt,
        links: [],
        role:"author",
        projectId: cachedValues.projectId,
        signature:"signature",
        authorId: cachedValues.authorId,
        capabilityType:"capability"
      },
      expected:{
        docId: cachedValues.docId,
        versionId: cachedValues.versionId,
        schemaName: 'role',
        createdAt: cachedValues.createdAt,
        updatedAt: cachedValues.updatedAt,
        links: [],
        role:"author",
        projectId: cachedValues.projectId,
        action: 'UNRECOGNIZED',
        signature:"signature",
        authorIndex:0,
        deviceIndex:0,
        authorId:cachedValues.authorId,
        capabilityType:"capability"
      }
    },
    {
      doc:{
        docId: cachedValues.docId,
        versionId: cachedValues.versionId,
        schemaName: 'device',
        createdAt: cachedValues.createdAt,
        updatedAt: cachedValues.updatedAt,
        links: [],
        action:"ban",
        authorId: cachedValues.authorId,
        projectId: cachedValues.projectId,
        signature:"mySignature",
        capabilityType:"someCapability",
      },
      expected:{
        docId: cachedValues.docId,
        versionId: cachedValues.versionId,
        schemaName: 'device',
        createdAt: cachedValues.createdAt,
        updatedAt: cachedValues.updatedAt,
        links: [],
        action:"ban",
        authorId: cachedValues.authorId,
        projectId: cachedValues.projectId,
        signature:"mySignature",
        authorIndex:0,
        deviceIndex:0,
        capabilityType:"someCapability",
      }
    },
    {
      doc:{
        docId: cachedValues.docId,
        versionId: cachedValues.versionId,
        schemaName: 'coreOwnership',
        createdAt: cachedValues.createdAt,
        updatedAt: cachedValues.updatedAt,
        links: [],
        action:"remove",
        coreId: cachedValues.coreId,
        projectId: cachedValues.projectId,
        storeType:"blob",
        signature:"mySig",
        authorId: cachedValues.authorId,
        capabilityType: "someCapability"
      },
      expected:{
        docId: cachedValues.docId,
        versionId: cachedValues.versionId,
        schemaName: 'coreOwnership',
        createdAt: cachedValues.createdAt,
        updatedAt: cachedValues.updatedAt,
        links: [],
        action:"remove",
        coreId: cachedValues.coreId,
        projectId: cachedValues.projectId,
        storeType:"blob",
        signature:"mySig",
        authorIndex: 0,
        deviceIndex: 0,
        authorId: cachedValues.authorId,
        capabilityType: "someCapability"
      }
    }
  ]
}
