import React, {PureComponent} from 'react';
import classNames from 'classnames';
import {parse} from 'date-fns';

import {formatDate, generateEventJSONLD} from './utils';
import Heading from '../Heading';
import Link from '../Link';
import styles from './ConferenceItem.scss';

interface Props {
  showCFP: boolean;
}

export default class ConferenceItem extends PureComponent<Props & Conference> {
  render() {
    const {
      name,
      topics,
      url,
      city,
      country,
      startDate,
      endDate,
      twitter,
      cfpEndDate,
      cfpUrl,
      showCFP,
    } = this.props;

    return (
      <div
        className={classNames(
          styles.ConferenceItem
        )}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: generateEventJSONLD({name, url, city, country, startDate, endDate})}}
        />
        <Heading element="p" level={4}>
          <Link url={url} external>
            {name}
          </Link>
        </Heading>
        <p className={styles.p}>
          {`${Location(city, country)}・`}
          <span className={styles.Date}>
            {formatDate(startDate, endDate)}
          </span>
        </p>
        <p className={classNames(styles.p, styles.Footer)}>
          {showCFP && <Cfp url={cfpUrl || url} date={cfpEndDate} />}
          {showCFP && <br />}
          <Topics topics={topics} />
          {twitter && ' – '}
          <Twitter twitter={twitter} />
        </p>
      </div>
    );
  }
}

interface TwitterProps {
  twitter: string;
}
function Twitter({twitter}: TwitterProps) {
  if (!twitter) { return null; }

  return (
    <Link url={`https://twitter.com/${twitter}`} external>
      {twitter}
    </Link>
  );
}

function Location(city: string, country: string) {
  if (city && country) {
    return `${city}, ${country}`;
  }

  return country || city;
}

interface CfpProps {
  url: string;
  date: string;
}

function Cfp({url, date}: CfpProps) {
  return (
    <Link url={url} external className={styles.cfp}>
      CFP closes {formatDate(parse(date))}
    </Link>
  );
}


interface TopicsProps {
  topics: string[];
}

function Topics({topics}: TopicsProps) {
  return <>{topics.map((topic) => `#${topic}`).join(' ')}</>;
}
