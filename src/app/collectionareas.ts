export class Collectionareas {
    displayFieldName: string;
    fieldAliases: FieldAliases;
    geometryType: string;
    spatialReference: SpatialReference;
    fields: Field[];
    features: Feature[];
}

export interface FieldAliases {
    OBJECTID: string;
    DAY: string;
    RECYCLE: string;
    GARBAGE: string;
    YARDWASTE: string;
    WEEK: string;
    SHAPEAREA: string;
    SHAPELEN: string;
}

export interface SpatialReference {
    wkid: number;
    latestWkid: number;
}

export interface Field {
    name: string;
    type: string;
    alias: string;
    length?: number;
}

export interface Attributes {
    OBJECTID: number;
    DAY: string;
    RECYCLE: string;
    GARBAGE: string;
    YARDWASTE: string;
    WEEK: string;
    SHAPEAREA: number;
    SHAPELEN: number;
}

export interface Geometry {
    rings: number[][][];
}

export interface Feature {
    attributes: Attributes;
    geometry: Geometry;
}

export class FeatureRespomse {
  features: Feature[];
}
