export interface UniqueIdField {
    name: string;
    isSystemMaintained: boolean;
}

export interface SpatialReference {
    wkid: number;
    latestWkid: number;
}

export interface Field {
    name: string;
    type: string;
    alias: string;
    sqlType: string;
    domain?: any;
    defaultValue?: any;
}

export interface Attribute {
    OBJECTID: number;
    STNO: number;
    STPRE: string;
    STNAME: string;
    STTYPE?: any;
    APT: string;
    CITY: string;
    ADDRESS: string;
    SERVICEDAY: string;
    RECYCLE: string;
    GARBAGE: string;
    YARDWASTE: string;
    SER_WEEK?: any;
    CREATED_USER: string;
    CREATED_DATE: number;
    LAST_EDITED_USER: string;
    LAST_EDITED_DATE: number;
}

export interface Geometry {
    x: number;
    y: number;
}

export interface Feature {
    attributes: Attribute;
    geometry: Geometry;
}

export interface UpdateResponse {
  updateResults: UpdateResults[];
}
export interface UpdateResults {
  objectId: number;
  globalId: any;
  success: string;
}

export interface GeoResponseSws {
    objectIdFieldName: string;
    uniqueIdField: UniqueIdField;
    globalIdFieldName: string;
    geometryType: string;
    spatialReference: SpatialReference;
    fields: Field[];
    features: Feature[];
}

export interface suggestions {
  text: string;
  magicKey: string;
  isCollection: boolean;
}

export interface RootObject {
  suggestions: suggestions[];
}

/**
 * Below object declare for NAP (Non applience)
 *
 * @export
 * @interface SWS_NAP_ServiceResponse
 */
export interface SWS_NAP_ServiceResponse {
  objectIdFieldName: string;
  uniqueIdField: UniqueIdField;
  globalIdFieldName: string;
  serverGens: string;
  geometryType: string;
  spatialReference: SpatialReference;
  fields: Field[];
  features: FeaturesSW[];
}
export interface ServerGens {
  minServerGen: number;
  serverGen: number;
}
export interface FeaturesSW {
  attributes: AttributeSW;
}
export interface AttributeSW {

}

export interface tokenResponseSws {
  token: string;
  expires: string;
  ssl: boolean;
}
