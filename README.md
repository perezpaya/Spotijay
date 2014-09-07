Spotijay
========

Useful tool to allow DJs to get tracks from their premium subscription in 320kbps and keep them synced

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


#Sync your playlists in background and forget about crashes interrupting your download
```shell
node app.js -u ramona123 -p m@ric@rmen -d ~/music_download
# We have now our config ready

# We now install forever to run this in the background and sync our playlists whenever we add music
npm install -g forever

forever start app.js playlist [spotify:playlistUrl]

# This will go to the background and we can go to sleep while our music is getting downloaded in 320kpbs

```

And done.