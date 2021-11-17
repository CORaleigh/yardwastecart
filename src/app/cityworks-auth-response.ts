export interface Value {
	Token: string;
}

export interface CityworksAuthResponse {
	Value: Value;
	Status: number;
	Message?: any;
	ErrorMessages: any[];
	WarningMessages: any[];
	SuccessMessages: any[];
}
