// this is not being used anymore as its only for raleigh locator

export interface SpatialReference {
    wkid: number;
    latestWkid: number;
}

export interface Location {
    x: number;
    y: number;
}

export interface Attribute { }

export interface Extent {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
}

export interface Candidate {
    address: string;
    location: Location;
    score: number;
    attributes: Attribute;
    extent: Extent;
}

export interface GeoResponse {
    spatialReference: SpatialReference;
    candidates: Candidate[];
}