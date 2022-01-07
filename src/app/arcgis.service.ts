import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { GeoResponse, Attribute } from './geo-response';
import { Collectionareas, FeatureRespomse } from './collectionareas';
import { RootObject, GeoResponseSws, SWS_NAP_ServiceResponse, tokenResponseSws, UpdateResponse } from './geo-response-sws';
import { MarRootObject } from './mar-response';
import { TitleCasePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ArcgisService {
  coordinates: any;
  // swsLocatorUrl = 'https://services.arcgis.com/v400IkDOw1ad7Yad/ArcGIS/rest/services/Solid_Waste_Collection/FeatureServer/1/query';
  swsLocatorUrlSDE = 'https://cityworksgisprd.raleighnc.gov/arcgis/rest/services/cityworks/SOLID_WASTE_SERVICES/FeatureServer/0/query';
  swsLocatorUrlForUpdateYesNo = 'https://cityworksgisprd.raleighnc.gov/arcgis/rest/services/cityworks/SOLID_WASTE_SERVICES/FeatureServer/0/query';
  // swsLocatorUrl ='https://cityworksgisprd.raleighnc.gov/arcgis/rest/services/MAR_Wake_Geocoder/GeocodeServer/findAddressCandidates';
  swsLocatorUrl = 'https://maps.raleighnc.gov/arcgis/rest/services/Locators/Locator/GeocodeServer/suggest';
  marUrl = 'https://maps.raleighnc.gov/arcgis/rest/services/Addresses/MapServer/2/query';
  compositeLocator = 'https://maps.raleighnc.gov/arcgis/rest/services/Locators/CompositeLocator/GeocodeServer/suggest'

  tokenSws: string;

  urlSRtoken = 'https://ral.maps.arcgis.com/sharing/generateToken';
  urlSRtokenBody = 'username=cityworks_ral&password=Azzzzt3ca&client=referer&referer=https://www.arcgis.com&f=json&expiration=43200';
  // mapsAPIbaseurl = 'https://services.arcgis.com/v400IkDOw1ad7Yad/ArcGIS/rest/services/SWS_NAP_Service/FeatureServer/0/query?';
  mapsAPIbaseurl = 'https://services.arcgis.com/v400IkDOw1ad7Yad/ArcGIS/rest/services/NAP_export/FeatureServer/0/query?';
  // mapsYeardwastAPIbaseurl = 'https://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/Yard_Wast_Opt_Out_test_layer/FeatureServer/0/updateFeatures?';
  // mapsYeardwastAPIbaseurl = 'https://cityworkstest.raleighnc.gov/arcgis/rest/services/Cityworks/SOLID_WASTE_SERVICES_edit/FeatureServer/0/updateFeatures?'
  mapsYeardwastAPIbaseurl = 'https://cityworks.raleighnc.gov/arcgis/rest/services/cityworks/SOLID_WASTE_SERVICES/FeatureServer/0/updateFeatures?'
  sdeData: Observable<RootObject>;
  // titlecasePipe: TitleCasePipe;
  addressStr: string;
  // where=upper(address)='11920 PAWLEYS mill CIR'&outFields=*&returnGeometry=false&f=json&token=
  /*
  // NAP changes ends
  */

  constructor(private http: HttpClient, private titlecasePipe:TitleCasePipe) { }

  private esriWorldLocatorUrl = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest';
  private geocodeUrl = 'https://maps.raleighnc.gov/arcgis/rest/services/Locators/CompositeLocator/GeocodeServer/findAddressCandidates';
  private peterLocatorUrl = 'https://cityworksgisprd.raleighnc.gov/arcgis/rest/services/MAR_Wake_Geocoder/GeocodeServer/findAddressCandidates';
  // private esriWorldLocatorUrl = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';
  private trashDayUrl = 'https://maps.raleighnc.gov/arcgis/rest/services/Services/PortalServices/MapServer/12/query';
  collectionAreaExtent = {
    xmin: 2054330.92561337,
    ymin: 715987.374691591,
    xmax: 2148717.34515728,
    ymax: 808419.684537664,
    spatialReference: {
      wkid: 2264
    }
  };


  geocodeFromMar(address): Observable<MarRootObject> {
    address = `ADDRESS like '${address}%'`;
    this.addressStr = JSON.stringify(address);
    this.addressStr = this.titlecasePipe.transform(this.addressStr);
    address = JSON.parse(this.addressStr);
    // const params = new HttpParams().append('where',this.addressStr).append('f', 'json').append('outfields', '*');

    const params = new HttpParams().append('where',address).append('f', 'json').append('outfields', '*');

      // .append('text', address).append('f', 'json');

    return this.http.get<MarRootObject>(this.marUrl, {
      params
    }).pipe(
      catchError(this.handleError));
  }

  geocodeRal(address): any {
    const params = new HttpParams()
      .append('Street', address).append('outSR', '2264')
      .append('f', 'json');

    return this.http.get<any>(this.geocodeUrl, {
      params
    }).pipe(map((coords) => console.log('inside geocode service', this.coordinates = coords)));
    // catchError(this.handleError));
  }

  // geocodeRal(address): Observable<GeoResponse> {
  //   const params = new HttpParams()
  //     .append('Street', address).append('outSR', '2264')
  //     .append('f', 'json');

  //   return this.http.get<GeoResponse>(this.geocodeUrl, {
  //     params
  //   }).pipe(
  //     catchError(this.handleError));
  // }

   geocodeswsSDE(address): Observable<GeoResponseSws> {
    address = `ADDRESS like '${address}%'`;
    const params = new HttpParams()
      .append('Where', address).append('outSR', '2264').append('f', 'json').append('returnGeometry', 'true').append('outFields', '*');

    return this.http.get<GeoResponseSws>(this.swsLocatorUrlSDE, {
      params
    }).pipe(
      catchError(this.handleError));
  }
  geocodesws(address): any {
    // address = `ADDRESS like '${address}%'`;
    const params = new HttpParams()
      .append('text', address).append('f', 'json');

    // address = `ADDRESS like '${address}%'`;
    address = `ADDRESS+like+'${address}%'`;
    const paramsSDE = new HttpParams()
      .append('Where', address).append('outSR', '2264').append('f', 'json').append('returnGeometry', 'true').append('outFields', '*');

    const fullUrl = `/${this.swsLocatorUrlSDE}?where=${address}&f=json&returnGeometry=true&outFields=*`
    return this.http.get<RootObject>(this.swsLocatorUrl, {
      params
    }).pipe(mergeMap(val => this.http.get<GeoResponseSws>(fullUrl)));
  }

  geocodeswsBAK(address): Observable<RootObject> {
    // address = `ADDRESS like '${address}%'`;
    const params = new HttpParams()
      .append('text', address).append('f', 'json');

    return this.http.get<RootObject>(this.swsLocatorUrl, {
      params
    }).pipe(
      catchError(this.handleError));
  }

  geocodeswsComposite(address): Observable<RootObject> {
    // address = `ADDRESS like '${address}%'`;
    const params = new HttpParams()
      .append('text', address).append('f', 'json');

    return this.http.get<RootObject>(this.compositeLocator, {
      params
    }).pipe(
      catchError(this.handleError));
  }

  geocodeswsOne(address): Observable<RootObject> {
    // address = `ADDRESS like '${address}%'`;
    const params = new HttpParams()
      .append('text', address).append('f', 'json');

    return this.http.get<RootObject>(this.esriWorldLocatorUrl, {
      params
    }).pipe(
      catchError(this.handleError));
  }

  // new method to get OBJECT-ID based on the street address
  getObjIdBasedOnStreetAdd(address): Observable<FeatureRespomse> {
    address = `ADDRESS like UPPER('${address}%')`;
    const params = new HttpParams()
      .append('where', address).append('returnGeometry ', 'false').append('outFields', 'OBJECTID').append('f', 'json');

    return this.http.get<FeatureRespomse>(this.swsLocatorUrlForUpdateYesNo, {
      params
    }).pipe(
      catchError(this.handleError));
  }
  geocode(address): Observable<GeoResponse> {
    const params = new HttpParams()
      // .append('SingleLine', address).append('category', 'Address').append('searchExtent', JSON.stringify(this.collectionAreaExtent))
      // .append('f', 'json').append('outSR', '2264');
      .append('Street', address).append('f', 'json');

    return this.http.get<GeoResponse>(this.peterLocatorUrl, {
      params
    }).pipe(
      catchError(this.handleError));
  }

  getTrashDay(geometry): Observable<Collectionareas> {
    const geometryStr = JSON.stringify(geometry);
    const params = new HttpParams()
      .append('geometry', geometryStr).append('geometryType', 'esriGeometryPoint')
      .append('inSR', '2264').append('outFields', 'WEEK, DAY').append('returnGeometry', 'false').append('f', 'json');

    return this.http.get<Collectionareas>(this.trashDayUrl, {
      params
    }).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  getGIS_NAP_Token(){
    const fullURLSRtoken = this.urlSRtoken + '?' + this.urlSRtokenBody;
    console.info('fullURLSRtoken--> ' + fullURLSRtoken);
    return this.http.get<tokenResponseSws>(fullURLSRtoken).pipe(
      catchError(this.handleError)
    );
  }
  // public callSWS_NAP_Service(address: string) {
  //   // Observable<SWS_NAP_ServiceResponse>
  //   console.info('address--> ' + address);
  //   this.foundNAPrecord = false;
  //   this.getGIS_NAP_Token().subscribe((data) => {
  //     if (data.token !== '') {
  //       this.tokenSws = data.token;
  //       console.info('this.tokenSws--> ' + this.tokenSws)
  //     }
  //     const urlparams = this.mapsAPIbaseurl + "where=upper(address)='" + address + "'"
  //       + "&outFields=*&returnGeometry=false&f=json&token=" + this.tokenSws ;
  //     console.info('urlparams--> ' + urlparams)
  //     this.http.get<GeoResponseSws>(urlparams).subscribe((data) => {
  //       console.info('this.data--> ' + data.fields);
  //       if (data.fields === undefined) {
  //         console.info('return--> false');
  //         this.foundNAPrecord = false;
  //       } else {
  //         console.info('return--> true');
  //         this.foundNAPrecord = true;
  //       }
  //     });
  //   });
  // }

    // New Yard wase code
    public callYardwase_Update_Service(ObjectId: string): Observable<UpdateResponse> {
      const featuresVal = '[{"attributes": {"OBJECTID": '+ObjectId+', "YARDWASTEBIN_OPT_OUT": "YES" }}]';
      const params = new HttpParams()
      .append('Features', featuresVal)
      .append('outFields', '*')
      .append('returnGeometry', 'false')
      .append('f', 'json');
      return this.http.post<UpdateResponse>(this.mapsYeardwastAPIbaseurl, params);
    }
    public callYardwase_Update_Service_OLD(ObjectId: string) {
      // Observable<SWS_NAP_ServiceResponse>
      console.info('address-ObjectId--> ' + ObjectId);
      // this.getGIS_NAP_Token().subscribe((data) => {
      //   if (data.token !== '') {
      //     this.tokenSws = data.token;
      //     console.info('this.tokenSws--> ' + this.tokenSws)
      //   }
        // const urlparams = this.mapsYeardwastAPIbaseurl + "Features=[{\"attributes\": {\"OBJECTID\": "+ObjectId+", \"yardwastebin_opt_out\": \"YES\" }}]'"
        //   + "&outFields=*&returnGeometry=false&f=json&token=" + this.tokenSws ;
        // const urlparams = this.mapsYeardwastAPIbaseurl + "Features={\"attributes\": {\"OBJECTID\": "+ObjectId+", \"yardwastebin_opt_out\": \"YES\" }}'"
        //   + "&outFields=*&returnGeometry=false&f=json" ;
        // console.info('urlparams--> ' + urlparams)
        // this.http.get<GeoResponseSws>(urlparams).subscribe((data) => {
        //   console.info('this.data responseUpdate--> ' + JSON.stringify(data)); //this.data responseUpdate--> {"error":{"code":405,"message":"'GET' method not supported.","details":[]}}
        //   if (data.fields === undefined) {
        //     console.info('return--> false');
        //   } else {
        //     console.info('return--> true');
        //   }
        // });

        const featuresVal = '[{"attributes": {"OBJECTID": '+ObjectId+', "YARDWASTEBIN_OPT_OUT": "YES" }}]';
        const params = new HttpParams()
      .append('Features', featuresVal)
      .append('outFields', '*')
      .append('returnGeometry', 'false')
      .append('f', 'json');
      console.info('urlparams-params-> ' + params)
    // body parameter is null since all data is in url parameters aka HttpParams
    return this.http.post<UpdateResponse>(this.mapsYeardwastAPIbaseurl, params).subscribe((data) => {
        console.info('mapsYeardwast responseUpdate-->> ' + JSON.stringify(data));
        console.info('mapsYeardwast responseUpdate-->> ' + data.updateResults);
        console.info('mapsYeardwast responseUpdate-->> ' + data.updateResults[0].success);
        // console.info('this.data responseUpdate-->> ' + data.geometryType);
        // console.info('this.data responseUpdate-->> ' + data.features);
        // console.info('this.data responseUpdate-->> ' + data.features);
        if (data.updateResults === undefined) {
          console.info('mapsYeardwast-return--> NOT updated');
          // return false;
        } else {
          console.info('mapsYeardwast-return--> Date-UPDATED');
          // return true;
        }
      });

      // });
    }
}
