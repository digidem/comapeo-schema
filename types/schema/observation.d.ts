/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * An observation is something that has been observed at a particular time and place. It is a subjective statement of 'I saw/heard this, here'
 */
export interface Observation {
  /**
   * Unique value that identifies this element
   */
  id: string;
  /**
   * Unique value that identifies this particular version of this element
   */
  version?: string;
  /**
   * RFC3339-formatted datetime of when the first version of the element was created
   */
  created_at: string;
  /**
   * RFC3339-formatted datetime of when this version of the element was created
   */
  timestamp?: string;
  /**
   * ID of the user who made this edit
   */
  userId?: string;
  /**
   * ID of the device that made this edit
   */
  deviceId?: string;
  /**
   * Must be `observation`
   */
  type: "observation";
  /**
   * Version ids of the previous document versions this one is replacing
   */
  links?: string[];
  /**
   * Version of this schema. Should increment for breaking changes to the schema
   */
  schemaVersion: 4;
  /**
   * latitude of the observation
   */
  lat?: number | null;
  /**
   * longitude of the observation
   */
  lon?: number | null;
  /**
   * Additional metadata associated with the observation (e.g. location precision, altitude, heading)
   */
  metadata?: {
    position?: Position;
    lastSavedPosition?: Position1;
    /**
     * Details of the location providers that were available on the device when the observation was recorded
     */
    positionProvider?: {
      /**
       * Whether the user has enabled GPS for device location (this is not the same as whether location is turned on or off, this is a device setting whether to use just wifi and bluetooth or use GPS for location)
       */
      gpsAvailable?: boolean;
      /**
       * Whether the device is configured to lookup location based on wifi and bluetooth networks
       */
      passiveAvailable?: boolean;
      /**
       * Has the user enabled location services on the device (this is often turned off when the device is in airplane mode)
       */
      locationServicesEnabled?: boolean;
      /**
       * Whether the device can lookup location based on cell phone towers
       */
      networkAvailable?: boolean;
      [k: string]: unknown;
    };
    /**
     * Whether location has been set manually
     */
    manual_location?: boolean;
  };
  /**
   * References to any nodes or ways that this observation is related to.
   */
  refs?: {
    /**
     * ID of the element that this observation references
     */
    id: string;
    [k: string]: unknown;
  }[];
  /**
   * media or other data that are attached to this observation
   */
  attachments?: {
    /**
     * unique ID that identifies the attachment
     */
    id: string;
    /**
     * string that describes the type of the attachment
     */
    type?: string;
    [k: string]: unknown;
  }[];
  /**
   * User-defined key-value pairs relevant to this observation
   */
  tags?: {
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
/**
 * Details of the position recorded for the observation
 */
export interface Position {
  /**
   * Timestamp of when the current position was obtained
   */
  timestamp?: number;
  /**
   * `true` if the position was mocked
   */
  mocked?: boolean;
  /**
   * Position details, should be self explanatory. Units in meters
   */
  coords?: {
    altitude?: number;
    heading?: number;
    longitude?: number;
    speed?: number;
    latitude?: number;
    accuracy?: number;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
/**
 * Details of the last saved position when the observation was recorded - useful if position is not recorded
 */
export interface Position1 {
  /**
   * Timestamp of when the current position was obtained
   */
  timestamp?: number;
  /**
   * `true` if the position was mocked
   */
  mocked?: boolean;
  /**
   * Position details, should be self explanatory. Units in meters
   */
  coords?: {
    altitude?: number;
    heading?: number;
    longitude?: number;
    speed?: number;
    latitude?: number;
    accuracy?: number;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
