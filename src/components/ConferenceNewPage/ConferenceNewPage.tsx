/* global process */
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import React, { useState, useRef } from 'react'
import { format } from 'date-fns'
import { sortBy } from 'lodash'
import classNames from 'classnames'
import { Helmet } from 'react-helmet'
import DatePicker from 'react-datepicker'
import Recaptcha from 'react-recaptcha'

import * as styles from './ConferenceNewPage.scss'
import { Card, Heading, Link, InputGroup } from 'src/components'

import { TOPICS } from '../config'
import './DatePickerOverrides.scss'
import ReactDatePicker from 'react-datepicker'

const SORTED_TOPICS_KEYS = sortBy(Object.keys(TOPICS), (x) =>
  TOPICS[x].toLocaleLowerCase()
)

const LOCATION_TYPES = [
  {
    value: 'online',
    name: 'Online',
  },
  {
    value: 'in-person',
    name: 'In person',
  },
  {
    value: 'hybrid',
    name: 'In person & online',
  },
]
const DATE_FORMAT = 'y-MM-dd'

const defaultConference: Conference = {
  name: '',
  url: '',
  city: '',
  country: '',
  startDate: null,
  endDate: null,
  topic: '',
  cfpUrl: '',
  cfpEndDate: null,
  cocUrl: '',
  online: true,
  offersSignLanguageOrCC: false,
  twitter: '@',
  comment: '',
}

const ConferenceNewPage: React.FC = () => {
  const endDateDatepickerRef = useRef<ReactDatePicker>(null)
  const [locationType, setLocationType] = useState('online')
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false)
  const [captchaResponse, setCaptchaResponse] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState(false)
  const [errors, setErrors] = useState({})
  const [conference, setConference] = useState(defaultConference)

  const handleDateChangeBuilder = (key: string) => {
    return (date: any) => {
      setConference({
        ...conference,
        [key]: date,
      })
    }
  }

  const handleDateChange = {
    startDate: handleDateChangeBuilder('startDate'),
    endDate: handleDateChangeBuilder('endDate'),
    cfpEndDate: handleDateChangeBuilder('cfpEndDate'),
  }

  const resetForm = () => {
    setSubmitted(false)
    setSubmitting(false)
    setConference(defaultConference)
  }

  const validateForm = (conference: Conference) => {
    const { topic, startDate, endDate, city, country, name, url } = conference

    const errors = {
      topic: topic.length === 0,
      // eslint-disable-next-line no-extra-boolean-cast
      startDate: !Boolean(startDate),
      // eslint-disable-next-line no-extra-boolean-cast
      endDate: !Boolean(endDate),
      city: city.length === 0,
      country: country.length === 0,
      name: name.length === 0,
      url: url.length === 0,
    }

    setErrors(errors)
    return errors
  }

  const handleStartDateSelect = (startDate: Date) => {
    const { endDate } = conference
    endDateDatepickerRef.current?.setFocus()
    setConference({
      ...conference,
      startDate,
      endDate: endDate || startDate,
    })
  }

  const handleFieldChange = (event: any) => {
    setConference({
      ...conference,
      [event.target.name]: event.target.value,
    })
  }

  const handleLocationTypeChange = (event: any) => {
    setLocationType(event.target.value)
    setConference({
      ...conference,
      online: ['online', 'hybrid'].includes(event.target.value),
    })
  }

  const handleCheckboxChange = (event: any) => {
    setConference({
      ...conference,
      [event.target.name]: !conference[event.target.name],
    })
  }

  // Executed once the captcha has been verified
  // can be used to post forms, redirect, etc.
  const handleVerifyRecaptcha = (captchaResponse: any) => {
    setCaptchaResponse(captchaResponse)
  }

  const handleFormSubmit = (event: React.FormEvent) => {
    const errors = validateForm(conference)
    event.preventDefault()
    const cannotBeSubmitted = Object.keys(errors).some((x) => errors[x])

    if (!recaptchaLoaded || captchaResponse === null) {
      return
    }
    if (cannotBeSubmitted) {
      return
    }

    setSubmitting(true)

    fetch(`${process.env.API_END_POINT_DOMAIN}/api/conferences`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'post',
      body: getConferenceData(conference),
    })
      .then((response) => {
        if (response.status === 200) {
          return setSubmitted(true)
        } else {
          return setSubmitting(false)
        }
      })
      .catch(() => {
        setSubmitting(false)
        setServerError(true)
      })
  }

  const hasError = (field: string) => {
    return errors[field]
  }

  const errorFor = (field: string, errorMessage: string) => {
    if (!errors[field]) {
      return null
    }

    return <div className={styles.errorText}>{errorMessage}</div>
  }

  const {
    name,
    url,
    topic,
    city,
    country,
    cfpUrl,
    twitter,
    comment,
    cocUrl,
    online,
    offersSignLanguageOrCC,
    startDate,
    endDate,
    cfpEndDate,
  } = conference

  return (
    <div>
      <Helmet>
        <title>Suggest a conference | Confs.tech</title>
        <meta name='robots' content='noindex' />
        <script src='https://www.google.com/recaptcha/api.js' async defer />
      </Helmet>
      <Heading element='h1'>Add a new conference</Heading>
      {!submitted && (
        <div>
          <p>
            Confs.tech is focused on conferences on software development and
            related topics, such as product management, UX, and AI.
          </p>
          <p>
            Know a conference on one of these topics? Feel free to submit it
            using this form!
          </p>
          <p>
            This will create a{' '}
            <Link
              external
              url='https://github.com/tech-conferences/conference-data/pulls'
            >
              pull request on GitHub
            </Link>{' '}
            where you can also add additional comments and track submission
            status. Our team will review your request as soon as possible!
          </p>
        </div>
      )}
      {submitted && <SubmittedMessage resetForm={resetForm} />}
      {!submitted && (
        <div>
          <Card>
            <form onSubmit={handleFormSubmit} autoComplete='off'>
              <InputGroup>
                <div>
                  <label htmlFor='type'>Topic</label>
                  <select
                    id='type'
                    className={classNames(hasError('topic') && styles.error)}
                    name='topic'
                    value={topic}
                    required
                    onChange={handleFieldChange}
                  >
                    <option key='placeholder' value=''>
                      Select a topic
                    </option>
                    {SORTED_TOPICS_KEYS.map((value: string) => (
                      <option key={value} value={value}>
                        {TOPICS[value]}
                      </option>
                    ))}
                  </select>
                  {errorFor('topic', 'Please select a topic.')}
                </div>
              </InputGroup>
              <InputGroup>
                <div>
                  <label htmlFor='name'>Conference name</label>
                  <input
                    className={classNames(hasError('name') && styles.error)}
                    type='text'
                    name='name'
                    required
                    autoComplete='off'
                    placeholder='Conference name (without year)'
                    value={name}
                    id='name'
                    onChange={handleFieldChange}
                  />
                  {errorFor('name', 'Name is required.')}
                </div>
              </InputGroup>
              <InputGroup>
                <div>
                  <label htmlFor='url'>URL</label>
                  <input
                    className={classNames(hasError('url') && styles.error)}
                    type='text'
                    placeholder='https://confs.tech'
                    required
                    value={url}
                    name='url'
                    id='url'
                    onChange={handleFieldChange}
                  />
                  {errorFor('url', 'Url is required.')}
                </div>
              </InputGroup>
              <InputGroup inline>
                <div>
                  <label htmlFor='startDate'>Start date</label>
                  <DatePicker
                    dateFormat={DATE_FORMAT}
                    name='startDate'
                    id='startDate'
                    selected={startDate}
                    onChange={handleStartDateSelect}
                  />
                  {errorFor('startDate', 'Start date is required.')}
                </div>
                <div>
                  <label htmlFor='endDate'>End date</label>
                  <DatePicker
                    ref={endDateDatepickerRef}
                    dateFormat={DATE_FORMAT}
                    name='endDate'
                    id='endDate'
                    selected={endDate}
                    onChange={handleDateChange.endDate}
                  />
                </div>
              </InputGroup>
              <InputGroup>
                <label htmlFor='locationType'>Location</label>
                <select
                  id='locationType'
                  name='locationType'
                  value={locationType}
                  required
                  onChange={handleLocationTypeChange}
                >
                  {LOCATION_TYPES.map((locationType) => (
                    <option key={locationType.value} value={locationType.value}>
                      {locationType.name}
                    </option>
                  ))}
                </select>
              </InputGroup>{' '}
              {locationType !== 'online' && (
                <InputGroup inline>
                  <div>
                    <label htmlFor='city'>City</label>
                    <input
                      className={classNames(hasError('city') && styles.error)}
                      required={locationType !== 'online'}
                      type='text'
                      id='city'
                      name='city'
                      value={city}
                      onChange={handleFieldChange}
                    />
                    {errorFor('city', 'City is required.')}
                  </div>
                  <div>
                    <label htmlFor='country'>Country</label>
                    <input
                      className={classNames(
                        hasError('country') && styles.error
                      )}
                      required={locationType !== 'online'}
                      type='text'
                      id='country'
                      name='country'
                      value={country}
                      onChange={handleFieldChange}
                    />
                    {errorFor('country', 'Country is required.')}
                  </div>
                </InputGroup>
              )}
              <InputGroup inline>
                <div>
                  <label htmlFor='cfpUrl'>CFP URL</label>
                  <input
                    className={classNames(hasError('cfpUrl') && styles.error)}
                    type='text'
                    name='cfpUrl'
                    id='cfpUrl'
                    value={cfpUrl}
                    onChange={handleFieldChange}
                  />
                  {errorFor('cfpUrl', 'CFP URL is required.')}
                </div>
                <div>
                  <label htmlFor='cfpEndDate'>CFP end date</label>
                  <DatePicker
                    dateFormat={DATE_FORMAT}
                    name='cfpEndDate'
                    id='cfpEndDate'
                    selected={cfpEndDate}
                    onChange={handleDateChange.cfpEndDate}
                  />
                </div>
              </InputGroup>
              <InputGroup>
                <label htmlFor='twitter'>Conference @TwitterHandle</label>
                <input
                  className={classNames(hasError('twitter') && styles.error)}
                  type='text'
                  name='twitter'
                  id='twitter'
                  value={twitter}
                  onChange={handleFieldChange}
                />
                {errorFor('twitter', 'Twitter handle is required.')}
              </InputGroup>
              <InputGroup>
                <label htmlFor='cocUrl'>Code Of Conduct URL</label>
                <input
                  type='text'
                  name='cocUrl'
                  id='cocUrl'
                  value={cocUrl}
                  onChange={handleFieldChange}
                />
              </InputGroup>
              <InputGroup inline>
                <input
                  type='checkbox'
                  name='offersSignLanguageOrCC'
                  id='offersSignLanguageOrCC'
                  checked={offersSignLanguageOrCC}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor='offersSignLanguageOrCC'>
                  This conference offers interpretation to International sign
                  language or closed captions.
                </label>
              </InputGroup>
              <InputGroup>
                <label htmlFor='comment'>
                  Additional comments and info{' '}
                  <i>(will only appear on GitHub)</i>
                </label>
                <textarea
                  name='comment'
                  id='comment'
                  value={comment}
                  onChange={handleFieldChange}
                />
              </InputGroup>
              <Recaptcha
                sitekey='6Lf5FEoUAAAAAJtf3_sCGAAzV221KqRS4lAX9AAs'
                render='explicit'
                verifyCallback={handleVerifyRecaptcha}
                onloadCallback={() => setRecaptchaLoaded(true)}
              />
              {serverError && (
                <p className={styles.errorText}>
                  An error happened from the server.
                  <br />
                  If it still happens, you can&nbsp;
                  <Link
                    external
                    url='https://github.com/tech-conferences/conference-data/issues'
                  >
                    create an issue on our GitHub repo.
                  </Link>
                </p>
              )}
              <button
                className={styles.Button}
                disabled={
                  submitting || !recaptchaLoaded || captchaResponse === null
                }
                type='submit'
                value='Submit'
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </Card>

          <Link
            external
            url='https://github.com/tech-conferences/conference-data/pulls'
          >
            Pull requests
          </Link>
          {' – '}
          <Link
            external
            url='https://github.com/tech-conferences/conference-data/issues'
          >
            Create an issue
          </Link>
          {' – '}
          <Link
            external
            url='https://github.com/tech-conferences/conference-data/'
          >
            GitHub repository
          </Link>
          {' – '}
          <Link external url='https://confs.tech/'>
            Go back to Confs.tech
          </Link>
        </div>
      )}
    </div>
  )
}

interface SubmittedMessageProps {
  resetForm(): void
}
const SubmittedMessage: React.FC<SubmittedMessageProps> = ({ resetForm }) => {
  return (
    <div>
      <p>Thank you for submitting a conference!</p>
      <p>
        We will soon review it, add it to the list and tweet it on{' '}
        <Link external url='https://twitter.com/ConfsTech'>
          @ConfsTech
        </Link>
        <br />
        Find your submission and track its status on{' '}
        <Link
          external
          url='https://github.com/tech-conferences/conference-data/pulls'
        >
          GitHub
        </Link>
        .
      </p>
      <p>
        <Link external url='https://github.com/tech-conferences/confs.tech/'>
          Contact us
        </Link>
        {' – '}
        <Link url='https://confs.tech/'>Go back to confs.tech</Link>
        {' – '}
        <Link onClick={resetForm}>Add a new conference</Link>
        {' – '}
        <Link external url='https://twitter.com/ConfsTech/'>
          Follow us on Twitter
        </Link>
      </p>
    </div>
  )
}
function getConferenceData(conference: Conference) {
  const { twitter, startDate, endDate, cfpEndDate } = conference

  return JSON.stringify({
    ...conference,
    twitter: twitter === '@' ? null : twitter,
    startDate: startDate ? format(startDate, DATE_FORMAT) : null,
    endDate: endDate ? format(endDate, DATE_FORMAT) : null,
    cfpEndDate: cfpEndDate ? format(cfpEndDate, DATE_FORMAT) : null,
  })
}

export interface Conference {
  name: string
  url: string
  city: string
  country: string
  startDate: Date | null | undefined
  endDate: Date | null | undefined
  topic: string
  cfpUrl: string
  cfpEndDate: Date | null | undefined
  twitter: string
  comment: string
  cocUrl: string
  online: boolean
  offersSignLanguageOrCC: boolean
}

export default ConferenceNewPage
