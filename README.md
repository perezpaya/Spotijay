Spotijay
========

# Spoiler
I'm not even proud of this. This code its ugly and unmaintainable. This was developed quickly to get songs from spotify to do some remixes, so I wrote this to get some songs in wav/mp3.
I'm not writing more code because I probably re-write this in Golang. Feel free to do what ever you want with this code

Useful tool that allows to get tracks from your premium spotify subscription in 320kbps and keep them synced

# Installation

Clone this repo

`git clone git@github.com:alexperezpaya/Spotijay.git`

## Mac

`brew install homebrew/binary/libspotify lame sox eyeD3`

## Arch Linux

`yaourt -S libspotify python2-eyed3 lame sox`

## Others

Check this: [http://docs.mopidy.com/en/v0.8.1/installation/libspotify/](http://docs.mopidy.com/en/v0.8.1/installation/libspotify/)

## Keys

Copy your [appkey](https://developer.spotify.com/my-account/keys) in the root of the dir.

`cd spotijay`

`npm install`

Run help to get help configuring your setup
`node app.js help`


# Sync your playlists in background and forget about crashes interrupting your download
```shell
node app.js config -u ramona123 -p m@ric@rmen -d ~/music_download
# We have now our config ready

# We now install forever to run this in the background and sync our playlists whenever we add music
npm install -g forever

forever start app.js playlist spotify:playlistURI

# This will go to the background and we can go to sleep while our music is getting downloaded in 320kpbs

```

And done.
