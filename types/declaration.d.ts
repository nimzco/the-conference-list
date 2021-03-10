interface Conference {
  objectID: string
  name: string
  online: boolean
  topics: string[]
  url: string
  city: string
  country: string
  startDate: string
  endDate: string
  twitter: string
  cfpEndDate: string
  cfpUrl: string
  affiliateText: string
  affiliateUrl: string
  cocUrl: string
  offersSignLanguageOrCC: boolean
}

declare module '*.scss' {
  const content: { [className: string]: string }
  export = content
}

declare module 'react-favicon' {
  export default React.Component
}
