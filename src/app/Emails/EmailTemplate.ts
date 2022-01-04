
export interface EmailTemplate {
  emailTo: string,
  emailCC: string,
  emailBCC: string,
  emailFrom: string,
  emailSubject: string,
  emailBody: EmailBody,
}

export interface EmailBody {
  templateType: string,
  logo: boolean,
  description: string,
  heading: string,
  headDetail: string,
  bodyDetail: string,
  addTable: boolean,
  listOfFields: any,
  footer: string
}

// listOfFields: [
//   Service,
//   Email template run auto,
//   Status,
//   Success,
//   Execution Time,
//   Mid night
// ]
