/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Presets define how map entities are displayed to the user. They define the icon used on the map, and the fields / questions shown to the user when they create or edit the entity on the map. The `tags` property of a preset is used to match the preset with observations, nodes, ways and relations. If multiple presets match, the one that matches the most tags is used.
 */
export interface Preset {
  /**
   * Version of schema. Should increment for breaking changes to the schema
   */
  schemaVersion?: 1;
  /**
   * Unique value that identifies this element
   */
  id: string;
  /**
   * Name for the feature in default language.
   */
  name: string;
  /**
   * Valid geometry types for the feature - this preset will only match features of this geometry type `"point", "vertex", "line", "area", "relation"`
   *
   * @minItems 1
   */
  geometry: [
    "point" | "vertex" | "line" | "area" | "relation",
    ...("point" | "vertex" | "line" | "area" | "relation")[]
  ];
  /**
   * The tags are used to match the preset to existing map entities. You can match based on multiple tags E.g. if you have existing points with the tags `nature:tree` and `species:oak` then you can add both these tags here in order to match only oak trees.
   */
  tags: {
    [k: string]: unknown;
  };
  /**
   * Tags that are added when changing to the preset (default is the same value as 'tags')
   */
  addTags?: {
    [k: string]: unknown;
  };
  /**
   * Tags that are removed when changing to another preset (default is the same value as 'addTags' which in turn defaults to 'tags')
   */
  removeTags?: {
    [k: string]: unknown;
  };
  /**
   * IDs of fields to displayed to the user when the preset is created or edited
   */
  fields?: string[];
  /**
   * Additional fields to display (used internally by Mapeo Desktop, no need to define this in preset)
   */
  additionalFields?: string[];
  /**
   * ID of preset icon which represents this preset
   */
  icon?: string;
  /**
   * Synonyms or related terms (used for search)
   */
  terms?: string[];
  /**
   * When presets are displayed as a list, defines the order it should be sorted. Presets with lowest sort numbers are displayed first
   */
  sort?: number;
}