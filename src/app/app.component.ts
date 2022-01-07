import { Component, OnInit } from "@angular/core";
import {HttpClientModule, HttpClient, HttpRequest, HttpResponse, HttpEventType} from '@angular/common/http';
import { CityworksService } from "./cityworks.service";
import { CityworksSrResponse } from "./cityworks-sr-response";
import { ArcgisService } from "./arcgis.service";
import { CityworksAuthResponse } from "./cityworks-auth-response";
import { CityworksValidateTokenResponse } from "./cityworks-validate-token-response";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { debounceTime, tap, switchMap, finalize, mergeMap } from "rxjs/operators";
import { GeoResponse, Candidate, Location } from "./geo-response";
import { CityworksSrRequest } from "./cityworks-sr-request";
import { MatDialog } from "@angular/material/dialog";
// import { Feature, Attributes } from './collectionareas';
import { TitleCasePipe } from "@angular/common";
import { UpperCasePipe } from "@angular/common";

import { WorldGeoResponse } from "./world-geo-response";
import { suggestions, Feature, UpdateResponse, RootObject } from "./geo-response-sws";
import { EmailTemplate } from './Emails/EmailTemplate';
import { IntegrationService } from './integration.service';
import { Observable } from "rxjs";
import { MarAttributes, MarFeature } from "./mar-response";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  percentDone: number;
  uploadSuccess: boolean;
  isOdd: boolean;
  recycleDay: Feature[] = [];
  isLoading: boolean;
  filteredAddresses: Feature[] = [];
  // suggestions: suggestions[] = []; // filteredAddresses: Candidate[] = [];
  marSuggestions: MarFeature[] = [];
  usersForm: FormGroup;
  deviceForm: FormGroup;
  subForm: FormGroup;
  uploadForm: FormGroup;
  selectionForm: FormGroup;
  problemSidDisplay: any;
  geoResponse: GeoResponse;
  worldGeoResponse: WorldGeoResponse;
  address = "1413 scales st";
  addressInValidMessage = '';
  addressInValidMessageCC = '';
  addressNotFoundMessage = '';
  addressObjectId = '';
  updateResponse: UpdateResponse;
  gisObjectId = 0;
  emailTemplate: EmailTemplate;
  error;
  token: string;
  public problemSids = [
    { value: "263551", display: "Garbage" },
    { value: "263552", display: "Recycling" },
    { value: "263553", display: "Yard Waste" }
  ];
  public mobileTabs = [
    { value: "missedForm", display: "Missed Collection" },
    { value: "checkStatus", display: "Check Status" }
  ];
  location: Location;
  ckSrStatussubmitted: boolean;
  // authResponse: any;
  srStatus: any;
  prjCompleteDate: any;
  prjCompleteStr: any;
  srNotFound: boolean;
  options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  day: string;
  cwSrResponse: CityworksSrResponse;
  submitted: boolean;
  reqid: number;
  week: string;
  isRecyclingWeek: string;
  cnt: number;
  addressNotFound: boolean;
  isNotRecyclingWeek: boolean;
  xcoord: any;
  ycoord: any;
  isMobile: boolean = false;
  foundNAPrecord: boolean;
  allData: unknown;

  constructor(
    private _dialog: MatDialog,
    private cityworksService: CityworksService,
    private arcgisService: ArcgisService,
    private integrationService: IntegrationService,
    private fb: FormBuilder,
    private titlecasePipe: TitleCasePipe,
    private upperCasePipe: UpperCasePipe,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cityworksService.getToken().subscribe(
      (data: CityworksAuthResponse) => {
        this.token = data.Value.Token;
        // use token for createRequest?
      },
      error => (this.error = error)
    );

    const PHONE_REGEX = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
    this.usersForm = this.fb.group({
      addressInput: [null, [Validators.required, Validators.maxLength(149)]],
      // problemSid: [null, Validators.required],
      // callerName: [null, Validators.required, Validators.maxLength(5)],
      callerHomePhone: [
        null,
        [Validators.required, Validators.pattern(PHONE_REGEX)]
      ],
      callerEmail: [null, [Validators.email]],
      // comments: ["", Validators.maxLength(799)],
      callerFirstName: [null, [Validators.required, Validators.maxLength(50)]],
      callerLastName: [null, [Validators.required, Validators.maxLength(50)]]
    });

    /*
    this.usersForm
      .get("addressInput")
      .valueChanges.pipe(
        debounceTime(300),
        tap(() => {
          this.isLoading = true;
          this.addressNotFound = false;
        }),
        switchMap(value =>
          this.arcgisService.geocodesws(value).pipe(
            finalize(() => {
              // console.log('Addressvalue = ', value );
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe(data => {
        // this.filteredAddresses = data.candidates;
        // this.filteredAddresses = data.features;
        // console.log('the filteredAddresses is ', this.filteredAddresses);
        // if (this.filteredAddresses.length === 1) {
        //   console.log('the filteredAddresses is--> ', this.filteredAddresses[0].attributes.OBJECTID);
        //   this.addressObjectId = '' + this.filteredAddresses[0].attributes.OBJECTID;
        // }

        this.suggestions = data.suggestions;
        console.log('the filteredAddresses is ', this.suggestions);

      });
      */
     
      this.usersForm
      .get("addressInput")
      .valueChanges.pipe(
        debounceTime(300),
        tap(() => {
          this.isLoading = true;
          this.addressNotFound = false;
        }),
        switchMap(value =>
          this.arcgisService.geocodeFromMar(value).pipe(
            finalize(() => {
              console.log('Addressvalue = ', value );
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe(data => {
        // this.suggestions = data.suggestions;
        this.marSuggestions = data.features;

        // this.allData = data;
        // console.log('the filteredAddresses is ', this.suggestions);
        console.log('the filteredAddresses is ', this.allData);

      })

      

    const numericOnly = "^(0|[1-9][0-9]*)$";
    this.subForm = this.fb.group({
      srInputId: [
        null,
        [
          Validators.maxLength(6),
          Validators.minLength(6),
          Validators.required,
          Validators.pattern(numericOnly)
        ]
      ]
    });
    this.checkMachine();

    this.deviceForm = new FormGroup({
      deviceId: new FormControl()
    });
  }

    
  method1(value: any): Observable<RootObject> {
    return this.arcgisService.geocodesws(value).pipe(
      finalize(() => {
        // console.log('Addressvalue = ', value );
        this.isLoading = false;
      })
    )
  }

  method2(value: any): any {
    return this.arcgisService.geocodeswsOne(value).pipe(
      finalize(() => {
        // console.log('Addressvalue = ', value );
        this.isLoading = false;
      })
    )
  }

  onFocusOutEvent(event: any){
    // console.log("onFocusOutEvent: "+event.target.value);
    // console.log("day : "+ this.day );
    // console.log("addressNotFound : "+ this.addressNotFound );
    this.addressInValidMessage = ""; // blank when user trying - add error message only at time of submit
    this.addressInValidMessageCC = ""; // blank when user trying - add error message only at time of submit
  }

  checkMachine() {
    var userApp = navigator.userAgent;

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(userApp))
    {
      console.log('Mobile..');
      this.isMobile = true;
    } else if (/Chrome/i.test(userApp)){
      console.log('Chrome..');
      this.isMobile = false;
    } else{
        console.log('Other..');
        this.isMobile = false;
    }
  }
  // displayFn(address: Candidate) {
  //   if (address) {
  //     return address.address;
  //   }
  // }

  // displayFnOLD(address: Feature) {
  //   this.addressInValidMessage = ""; // blank when user trying - add error message only at time of submit
  //   this.addressInValidMessageCC = ""; // blank when user trying - add error message only at time of submit
  //   if (address) {
  //     let titleCaseAddress = address.attributes.ADDRESS;
  //     const titleCaseDay = address.attributes.SERVICEDAY;

  //     titleCaseAddress = this.titlecasePipe.transform(titleCaseAddress);
  //     return titleCaseAddress;
  //   }
  // }
  displayFn(address: MarFeature) {
    this.addressInValidMessage = ""; // blank when user trying - add error message only at time of submit
    this.addressInValidMessageCC = ""; // blank when user trying - add error message only at time of submit
    console.log('address from displayFn', address);
    if (address) {
      let titleCaseAddress = address.attributes.ADDRESS;
      // const titleCaseDay = address.attributes.SERVICEDAY;

      titleCaseAddress = this.titlecasePipe.transform(titleCaseAddress);
      console.log('titleCaseAddress = ', titleCaseAddress);
      // let titleCaseAddress = address.attributes.ADDRESS;
      // let titleCaseAddress = address.text;
      // let titleCaseAddress = address;
      // const titleCaseDay = address.attributes.SERVICEDAY;

      // titleCaseAddress = this.titlecasePipe.transform(titleCaseAddress);
      return titleCaseAddress;
    }
  }

  checkSRStatus() {
    this.ckSrStatussubmitted = true;
    const requestId = { RequestId: this.subForm.get("srInputId").value };
    this.cityworksService.getServiceRequest(requestId, this.token).subscribe(
      data => (this.cwSrResponse = data),
      err => (this.error = err),
      () => {
        this.ckSrStatussubmitted = false;
        if (
          this.cwSrResponse.WarningMessages.length < 1 &&
          this.cwSrResponse.ErrorMessages.length < 1
        ) {
          this.srStatus = this.cwSrResponse.Value.Status;
          if (this.srStatus === "INPROG") {
            this.srStatus = "In Progress";
          }
          if (this.srStatus === "CLOSED") {
            this.srStatus = "Completed";
          }
          if (this.srStatus === "CANCEL") {
            this.srStatus = "Cancelled";
          }
        } else {
          this.srNotFound = true;
          this.srStatus = undefined;
        }
      }
    );
  }

  UploadFile(){
    console.info(">>>"+document.getElementById("upload"));
  }

  save(model: any, isValid: boolean) {

    ////////////////////////////////
    // const addressInput = this.usersForm.get("addressInput").value.attributes;
    // let addressInput = this.usersForm.get("addressInput").value.text;
    let addressInput = this.usersForm.get("addressInput").value;
    // console.log('At Save0 - addressInput: ', addressInput);
    // addressInput = `{ "text": ${addressInput} }`;
    // console.log('At Save1 - addressInput: ', `{ "text": ${addressInput} }`);

    // if (typeof(addressInput === 'string')) {
    //   addressInput = JSON.parse(`{ "text": ${addressInput} }`);
    // }
    // console.log('At Save2 - addressInput: ', addressInput);
    if(addressInput){
      // this.getAddressObjectID(addressInput, model);
      console.info('address for ObjId='+addressInput);
      const adrArray = addressInput.split(',');
      const addStreet = adrArray[0];
      console.info('address-Street for ObjId='+addStreet);

      this.arcgisService.getObjIdBasedOnStreetAdd(addStreet).subscribe(
      FeatureRespomse => {
          if (FeatureRespomse.features.length === 0) {
            const comment = `This address was not found in the RALEIGH.SWS_COLLECTIONS GIS data: ${addressInput}`;
            this.createCWAddressWrongTicket(addressInput, comment, model);
            // this.addressNotFoundMessage ='The address you entered does not appear to be within the Raleigh Solid Waste service area, we will investigate and contact you if necessary.';
            this.addressNotFoundMessage ='';

          } else if (FeatureRespomse.features.length > 1) {
            const comment = `Multiple addresses were matched in the RALEIGH.SWS_COLLECTION GIS data: ${addressInput}`;
            this.createCWAddressWrongTicket(addressInput, comment, model);
            // this.addressNotFoundMessage ='The address you entered does not appear to be within the Raleigh Solid Waste service area, we will investigate and contact you if necessary.';
            this.addressNotFoundMessage ='';
          } else {
            this.addressNotFoundMessage ='';
            this.gisObjectId = FeatureRespomse.features[0].attributes.OBJECTID;
            console.info('this.gisObjectId-->>>'+ this.gisObjectId);
    //       }
    //     });
    // }
    // if(this.gisObjectId > 0) {
          console.log('Address Valid');
          this.addressObjectId = ''+this.gisObjectId;
          const addressInputArray = addressInput.split(','); // 1413 Dellwood Dr, Raleigh, NC, 27607
          console.info('address-Street for inputs='+addressInputArray[0]);
          // this.updateResponse = this.arcgisService.callYardwase_Update_Service(this.addressObjectId);
          // console.info("callYardwase_Update_Service--updateResponses= " + updateResponses);
          this.arcgisService.callYardwase_Update_Service(this.addressObjectId).subscribe((data) => {
            // console.info('mapsYeardwast responseUpdate-->> ' + JSON.stringify(data));
            // console.info('mapsYeardwast responseUpdate-->> ' + data.updateResults);
            // console.info('mapsYeardwast responseUpdate-->> ' + data.updateResults[0].objectId);
            // this.gisObjectId = data.updateResults[0].objectId;

              this.addressInValidMessage = '';
              this.addressInValidMessageCC = '';

              // Logic 2 for email option
              console.log('I am in logic-2 to create SR');
              const request = new CityworksSrRequest();
              // NEW LOGIC
              request.address = addressInputArray[0];
              request.callerCity = addressInputArray[1];
              /*if (model.addressInput.attributes) {
                request.address = model.addressInput.attributes.ADDRESS;
              }
              if (!request.address) {
                request.address = model.addressInput;
              }
              if (model.addressInput.attributes) {
                request.callerAddress = model.addressInput.attributes.ADDRESS;
              }
              if (!request.callerAddress) {
                request.callerAddress = model.addressInput;
              }
              request.callerCity = "Raleigh";
              */
              request.callerEmail = model.callerEmail;
              request.callerHomePhone = model.callerHomePhone;
              request.callerFirstName = model.callerFirstName;
              request.callerLastName = model.callerLastName;
              request.problemSid = '264073';
              //request.details = updateResponses[0].objectId;
              request.details = 'GIS ID - ' + this.gisObjectId;
              // request.comments = 'Hey ' + model.callerFirstName + '! Your yard waste opt-out request has been taken.';
              request.comments = 'Thank you for completing the opt-out form. We will remove your address from the cart delivery list.';
            console.info("Yardwaste opt-out problemID for SR= " + request.problemSid);

            // below is commentsed for testing purpose so that system would not create OPT-OUT ticket
    
              this.cityworksService.createServiceRequest(request, this.token).subscribe(
                (data: CityworksSrResponse) => {
                  console.info("createServiceRequest response-data= " + data);
                  this.cwSrResponse = {
                    ...data
                  };
                  this.submitted = true;
                  console.info("createServiceRequest response= " + this.cwSrResponse);
                  this.reqid = this.cwSrResponse.Value.RequestId;
                  console.info("Yardwaste opt-out SR-ReqID = " + this.reqid);
                  ///////////////////////////////////////////////////////////////////////////////////////////////////////
                  if(this.reqid > 0){
                    // logic email option 2.2 -- +'"RequestId": "<the request id returned from the create SR API call>",'
                    const reqAddToRequest = '{'
                      +'"RequestId": "'+this.reqid+'",'
                      +'"Lastname": "Foley",'
                      +'"Firstname": "Chad",'
                      +'"CustAddress": "1413 Scales St}",'
                      +'"Email": "chad.foley@raleighnc.gov",'
                      +'"CellPhone": "919-389-3777",'
                      +'"CustCity": "Raleigh", }';
                    console.info("calling addToRequest with req = " + reqAddToRequest);

                    // this.cityworksService.addToRequest(reqAddToRequest, this.token).subscribe(
                    //   (data: CityworksSrResponse) => {
                    //     console.info("response of addToRequest = " + data);
                    //   },
                    //   err => (this.error = err)
                    // );
                  }
                },
                err => (this.error = err)
              ); 
            });

          }
        });
        this.submitted = false;
        this.usersForm.reset();
        
    } else {
      this.submitted = false;
      // console.log('Address NOT Valid ');
      this.day = '';
      this.addressNotFound = true;
      // this.updateResponse = '';
      this.gisObjectId = 0;
      this.addressInValidMessage = 'You must choose an address from the drop down list of address suggestions. If your address does not appear in the drop down list then your address is not in the City limits.';
      this.addressInValidMessageCC = 'Please call 919-996-3425 or email sws@raleighnc.gov if you have any questions.';
      // this.usersForm.reset();
    }
  }

  getAddressObjectID(addressInput: string, model: any){
    console.info('address for ObjId='+addressInput);
    const adrArray = addressInput.split(',');
    const addStreet = adrArray[0];
    console.info('address-Street for ObjId='+addStreet);

    this.arcgisService.getObjIdBasedOnStreetAdd(addStreet).subscribe(
      FeatureRespomse => {
          if (FeatureRespomse.features.length === 0) {
            const comment = 'in CW-GIS not found this address: '+addressInput;
            this.createCWAddressWrongTicket(addressInput, comment, model);
          } else if (FeatureRespomse.features.length > 1) {
            const comment = 'in CW-GIS not found many similar address objectids: '+addressInput;
            this.createCWAddressWrongTicket(addressInput, comment, model);
          } else {
            this.gisObjectId = FeatureRespomse.features[0].attributes.OBJECTID;
            console.info('this.gisObjectId-->>>'+ this.gisObjectId);
          }
        });
    console.info('this.gisObjectId2-->'+ this.gisObjectId);
  }

  createCWAddressWrongTicket(addressInput: string, comment: string, model: any) {
      console.log('I am in new-logic-2 to create SR > createCWAddressWrongTicket');
      const addressInputArray = addressInput.split(','); // 2451 Carriage Oaks Dr, Raleigh, NC, 27614
      const request = new CityworksSrRequest();
      request.address = addressInputArray[0];
      request.callerCity = addressInputArray[1];
      request.callerEmail = model.callerEmail;
      request.callerHomePhone = model.callerHomePhone;
      request.callerFirstName = model.callerFirstName;
      request.callerLastName = model.callerLastName;
      request.problemSid = '264076';
      //request.details = updateResponses[0].objectId;
      request.details = 'User entered address -> ' + addressInput;
      request.comments = comment;
      console.info("Yardwaste opt-out problemID for SR= " + request.problemSid);

      this.cityworksService.createServiceRequest(request, this.token).subscribe(
        (data: CityworksSrResponse) => {
          console.info("createServiceRequest response-data= " + data);
          this.cwSrResponse = {
            ...data
          };
          // this.submitted = false;
          console.info("createCWAddressWrongTicket response= " + this.cwSrResponse);
          this.reqid = this.cwSrResponse.Value.RequestId;
          console.info("Yardwaste opt-out SR-ReqID/createCWAddressWrongTicket = " + this.reqid);
          this.gisObjectId = this.reqid; // this is not tha adddress object Id but just to show message that you req has been taken
        },
        err => (this.error = err)
      );
      // call to sent email to City person
      this.sentEmailTemplate(addressInput, comment, model);
  }

  openDialog(page: string) {

  }

  // File upload code


  upload(files: File[]){
    //pick from one of the 4 styles of file uploads below
    this.uploadAndProgress(files);
  }

  uploadAndProgress(files: File[]){
    console.log(files)
    var formData = new FormData();
    // Array.from(files).forEach(f => formData.append('file',f))
    var caseRelDocsData = {};
    // caseRelDocsData.CaObjectId = 1000315;
    // formData.append("file", file);

    this.http.post('https://file.io', formData, {reportProgress: true, observe: 'events'})
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.percentDone = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.uploadSuccess = true;
        }
    });
    // Request can be edited and pasted into browser URL bar
    // --------------------------------------------------------------------------------
    // https://cityworkstest.raleighnc.gov/cityworkstest/services/Ams/Attachments/AddRequestAttachment?data={
    //     "Comments": null,
    //     "Filename": null,
    //     "RequestId": null
    // }
  }

  sentEmailTemplate(addressInput: string, comment: string, model: any) {
    console.info('I am in sentEmailTemplate');
    // below email send option is stopped because we are getting CORS issue from Cityworks
    if(this.updateResponse != undefined) {
        const emailId = this.usersForm.get("callerEmail").value;
        this.emailTemplate = {
          emailTo: 'Charles.Foley@raleighnc.gov,surender.dalal@raleighnc.gov',
          emailCC: '',
          emailBCC: 'Charles.Foley@raleighnc.gov',
          emailFrom: '',
          emailSubject: 'Yard Waste opt-out address entered wrong',
          emailBody: {
            templateType: 'message',
            logo: true,
            description: 'This is your Yard Waste opt-out address issue notification',
            heading: ' address issue notification',
            headDetail: 'Below entered address in request form has issue',
            bodyDetail: '',
            addTable: true,
            listOfFields: [
              "Address",
              addressInput,
              "Name",
              model.callerFirstName + ', ' + model.callerLastName,
              "Phone",
              model.callerHomePhone,
              "Email",
              model.callerEmail
            ],
            footer: ''
          }
        }

        this.integrationService.sentEmail(this.emailTemplate  ).subscribe((dataFileName: string) => {
          console.log('email-status -> ' + dataFileName);
      });
    }
  }

}


// function EmailTemplate(emailTemplate: any, EmailTemplate: any) {
//   throw new Error("Function not implemented.");
// }
// tokenIsValid: boolean;
// cwSrResponse: CityworksSrResponse;
// cwAuthResponse: CityworksAuthResponse;
// cwAuthValResponse: CityworksValidateTokenResponse;

// this.cityworksService.validateToken().subscribe(
//   (data: CityworksValidateTokenResponse) => {
//     this.tokenIsValid = data.Value;
//     if (!this.tokenIsValid) {
//     }
//   },
//   error => {
//     this.error = error;
//   }
// );
