export interface UserInputIntfce {
        OBJECTID: string;
        CSAID: string;
        ADDRESSUUID: string;
        ADDR_ID: string;
        REID: string;
        NCPIN: string;
        NCPIN_EXT: string;
        ADDRESS: string;
        COMPLETE_ADDRNUM: string;
        COMPLETE_STREET_NAME: string;
        SUBADDR_TYPE: string;
        SUBADDR_NUM: string;
        OFFICIALSTATUS: string;
        LIFECYCLE: string;
        FEATURETYPE: string;
        CORP_CITY: string;
        CITY_ABBREV: string;
        USPS_CITY: string;
        ZIPCODE: string;
        PLAN_JURIS: string;
        PLAN_JURIS_ABBREV: string;
        COUNTY: string;
        STATE: string;
        ADDRNUM_PREFIX: string;
        ADDRNUM: string;
        ADDRNUM_SUFFIX: string;
        PREDIR: string;
        PRE_MODIFIER: string;
        PRE_TYPE: string;
        STNAME: string;
        STREET_TYPE: string;
        POSTDIR: string;
        POST_MODIFIER: string;
        CREATE_USER: string;
        CREATE_DATE: string;
        UPDATE_USER: string;
        UPDATE_DATE: string;
        ADDR_AUTHORITY: string;
        SEGMENTUUID: string;
        LABLANGLE: string;
        QC_STATUS: string;
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

    export interface UserAttributes {
        OBJECTID: number;
        CSAID: number;
        ADDRESSUUID: string;
        ADDR_ID: number;
        REID: string;
        NCPIN: string;
        NCPIN_EXT: string;
        ADDRESS: string;
        COMPLETE_ADDRNUM: string;
        COMPLETE_STREET_NAME: string;
        SUBADDR_TYPE: string;
        SUBADDR_NUM: string;
        OFFICIALSTATUS: string;
        LIFECYCLE: string;
        FEATURETYPE: string;
        CORP_CITY: string;
        CITY_ABBREV: string;
        USPS_CITY: string;
        ZIPCODE: string;
        PLAN_JURIS: string;
        PLAN_JURIS_ABBREV: string;
        COUNTY: string;
        STATE: string;
        ADDRNUM_PREFIX?: any;
        ADDRNUM: string;
        ADDRNUM_SUFFIX?: any;
        PREDIR?: any;
        PRE_MODIFIER?: any;
        PRE_TYPE?: any;
        STNAME: string;
        STREET_TYPE: string;
        POSTDIR?: any;
        POST_MODIFIER?: any;
        CREATE_USER: string;
        CREATE_DATE: any;
        UPDATE_USER: string;
        UPDATE_DATE: any;
        ADDR_AUTHORITY: string;
        SEGMENTUUID: string;
        LABLANGLE?: any;
        QC_STATUS?: any;
    }

    export interface Geometry {
        x: number;
        y: number;
    }

    export interface Feature {
        attributes: UserAttributes;
        geometry: Geometry;
    }

    export interface RootObject {
        displayFieldName: string;
        fieldAliases: UserInputIntfce;
        geometryType: string;
        spatialReference: SpatialReference;
        fields: Field[];
        features: Feature[];
    }

