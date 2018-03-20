# Confs.tech | Yet another conference website

List of conferences pulled out from [JSON files](https://github.com/tech-conferences/confs.tech/tree/master/conferences).
- [See all JavaScript conferences](https://confs.tech/javascript)
- [See all CSS conferences](https://confs.tech/css)
- [See all PHP conferences](https://confs.tech/php)
- [See all Design / UX conferences](https://confs.tech/ux)
- [See all Ruby conferences](https://confs.tech/ruby)
- [See all iOS conferences](https://confs.tech/ios)
- [See all Technical communication conferences](https://confs.tech/tech-comm)
- [See all Data conferences](https://confs.tech/data)
- [See all Dev Ops conferences](https://confs.tech/devops)
- [See all Android conferences](https://confs.tech/android)
- [See general conferences](https://confs.tech/general)

Don't hesitate to add new conferences by [creating an issue](https://github.com/tech-conferences/confs.tech/issues/new) or creating a pull request. 🤓

## Adding a conference

Conferences are JSON based files. They have the following structure:

```json
  {
    "name": "",
    "url": "",
    "startDate": "2018-08-17",
    "endDate": "2018-08-19",
    "city": "",
    "country": "",
    "cfpUrl": "",
    "cfpEndDate": "",
    "twitter": ""
  }
```

Dates are formatted like `YYYY-MM-DD`, and if the date has not been defined yet, you can use this format as well: `YYYY-MM`.

- To add JavaScript conferences, create a Pull Request on the [javascript-conferences repo](https://github.com/tech-conferences/javascript-conferences).
- For all other conferences, create a Pull Request on this repo.


## Active contributors
- [Nima Izadi](https://nimz.co)
- [Ekaterina Prigara](https://twitter.com/katyaprigara)
- [Trivikram Kamat](https://twitter.com/trivikram)

Because together we are stronger, we are looking for other contributors. So hit us and let's contribute!

## Credits
Most of the conferences are originally pulled from other repo:
- Ruby: [ruby-conferences/ruby-conferences.github.io](https://github.com/ruby-conferences/ruby-conferences.github.io)
- Android: [AndroidStudyGroup/conferences](https://github.com/AndroidStudyGroup/conferences)
- iOS: [Lascorbe/CocoaConferences](https://github.com/Lascorbe/CocoaConferences)
- UX: [CSS Tricks conference guide](https://css-tricks.com/guide-2017-conferences)

## License

[MIT](LICENSE.md)
