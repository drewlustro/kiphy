# Kiphy

> Takehome assignment by Drew Lustro

### Prerequisites

This application requires `node` and `npm` to build and run. You may need to install [Xcode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12) from the Apple App Store for essential development tools. We use `homebrew` to acquire `node` and generally make life easier.

First install `homebrew` on a fresh macOS / OS X installation:

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Now update `homebrew` and install node:

```bash
brew update
brew install node
brew install git   # optional, but helpful in the future
```

Once this process completes, you should have both `node` and `npm` installed.

## Get The Code

To checkout the code tree for Kiphy via `git`:

```bash
git clone https://github.com/drewlustro/kiphy.git
cd kiphy
```

Alternatively, download and unzip the source code from the [repository homepage](https://github.com/drewlustro/kiphy), then `cd` into the directory:

```bash
cd ~/Downloads
unzip kiphy-master.zip
cd kiphy-master
```

## Develop &amp; Run

Make sure your terminal session's current working directory is in the Kiphy source code folder.

First install development dependencies:

```bash
npm install
```

To begin development:

```bash
npm run dev
```

Once the development build is complete, navigate your web browser to [http://localhost:4000](http://localhost:4000).

## Build

To build for production:

```bash
npm run build
```

The completed build will be located in the `dist/` subfolder.

## Test

To lint code:

```bash
npm run lint
```

## Changelog

Version | Time | Note
----: | ---- | ----
`1.0.0` | March 24, 7:00pm  | Responsive HiDPI pass; Axois instance for API, Vuex mutation keys, Documentation.
`0.6.0` | March 23, 9:00pm  | Shuffle implemented. Responsive mobile pass on Searchbox
`0.5.0` | March 23, 7:00pm | Favorites implemented via LocalStorage.
`0.4.0` | March 23, 3:00pm | Prep responsive Sass libs; new Navigation component; quick sanity responsive pass on primary views.
`0.3.0` | March 21, 9:05pm | Split overweight index view into 3 views (index, search, single); Slim down / mild refactor vuex store.
`0.2.0` | March 21, 6:32pm | Crude gif search set &amp; search single routes work, stored in vuex. Add animate on cursor hover, simple breadcrumb. 
`0.1.0` | March 21, 12:27pm | Chose modern vue2 boilerplate `egoist/vuepack` and scaffolded using `vue-cli`.






