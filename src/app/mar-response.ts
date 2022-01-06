export interface MarFieldAliases {
  ADDRESS: string;
}

export interface MarField {
  name: string;
  type: string;
  alias: string;
  length: number;
}

export interface MarAttributes {
  ADDRESS: string;
}

export interface MarFeature {
  attributes: MarAttributes;
}

export interface MarRootObject {
  displayFieldName: string;
  fieldAliases: MarFieldAliases;
  fields: MarField[];
  features: MarFeature[];
}
