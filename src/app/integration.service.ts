
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { EmailTemplate } from './Emails/EmailTemplate';


@Injectable({
  providedIn: 'root'
})
export class IntegrationService {

  constructor(
    private httpClient: HttpClient
  ) { }

  //private fuseBaseUrl = `http://cityconnect.raleighnc.gov/RaleighAPI/`;
  private fuseEmailUrl = 'https://cityconnect.raleighnc.gov/RaleighAPI/';

  public sentEmail(emailTemplate: EmailTemplate) {
    const headers = new HttpHeaders().set(
      'Content-Type', 'application/json'
    );
    return this.httpClient.post<string>(this.fuseEmailUrl + 'email/sendEmailInTemplate', emailTemplate,
          { headers, responseType: 'text' as 'json' }
        );

      // "{
      //   \"emailTo\":\"surender.dalal@raleighnc.gov\",
      //   \"emailCC\":\"\",
      //   \"emailBCC\":\"\",
      //   \"emailFrom\":\"surender.dalal@raleighnc.gov\",
      //   \"emailSubject\":\"This is my template with Spencer\",
      //   \"emailBody\":{
      //      \"templateType\": \"message\",
      //      \"logo\":true,
      //      \"description\":\"This is my first template\",
      //      \"heading\":\"Sample Number 1\",
      //      \"headDetail\":\"This is header details of sample type one\",
      //      \"bodyDetail\":\"\",
      //      \"addTable\":true,
      //      \"listOfFields\":[
      //         \"Service\",
      //         \"Email template run auto\",
      //         \"Status\",
      //         \"Success\",
      //         \"Execution Time\",
      //         \"Mid night\"
      //      ],
      //      \"footer\":\"\"
      //   }
      // }";

  }



}
