// @flow strict

// Technically, the callbacks with error parameters would be a union of
// [Error, void] and [void, Data], but I don't know how to type that properly.

declare module 'ytsr' {
  declare type Result = {|
    +query: string,
    +items: Array<{|
      +title: string,
      +url: string,
      +author: {|
        +name: string
      |},
      +bestThumbnail: {|
        url: ?string,
        width: number,
        height: number
      |}
    |}>
  |};

  declare module.exports: {
    (
      searchString: string,
      options?: {|
        +limit: ?number
      |}
    ): Promise<Result>,
    getFilters: (
      searchString: string
    ) => Promise<
      Map<
        string,
        Map<
          string,
          {|
            +url: ?string,
            +name: string,
            +description: string,
            +active: boolean
          |}
        >
      >
    >
  };
}

declare module 'ytdl-core' {
  declare type Format = {
    +url: string
  };

  declare type Info = {|
    +videoDetails: {|
      +title: string,
      +author: {|
        +name: string
      |},
      +videoId: string,
      +lengthSeconds: number
    |},
    +player_response: {|
      +videoDetails: {|
        +viewCount: string, // Number stored as a string
        +thumbnail: {|
          +thumbnails: Array<{|
            +width: number,
            +height: number,
            +url: string
          |}>
        |}
      |}
    |},
    +related_videos: Array<{|
      +author: {
        +name: string
      },
      +id: string,
      +length_seconds: number,
      +title: string,
      +video_thumbnail: string,
      +view_count: string, // Bug where only the first comma is removed
      +thumbnails: Array<{|
        url: string,
        width: number,
        height: number
      |}>
    |}>,
    +formats: Array<Format>
  |};

  declare type Options = {
    +quality: 'highestaudio'
  };

  declare module.exports: {
    getBasicInfo: (url: string, options: ?Options) => Promise<Info>, // Less data than getInfo, but doesn't seem to throw
    getInfo: (url: string, options: ?Options) => Promise<Info>,
    chooseFormat: (formats: Array<Format>, options: Options) => Format,
    downloadFromInfo: (info: Info) => ReadableStream
  };
}

declare module 'he' {
  declare module.exports: {
    decode: (html: string) => string
  };
}

declare module 'fluent-ffmpeg' {
  declare type Progress = {
    +frames: number,
    +currentFps: number,
    +currentKbps: number,
    +targetSize: number,
    +timemark: string,
    +percent: number
  };

  declare type Metadata = {
    +format: {|
      +duration: string,
      +tags: {|
        +title?: string,
        +artist?: string
      |}
    |}
  };

  declare class Command {
    audioBitrate(bitrate: number): this;
    outputOptions(...options: Array<string>): this;
    save(path: string): this;
    on('progress', callback: (progress: Progress) => mixed): this;
    on('end', callback: () => mixed): this;
  }

  declare module.exports: {
    (stream: ReadableStream): Command,
    ffprobe: (
      path: string,
      callback: (err: ?Error, metadata: Metadata) => mixed
    ) => void,
    setFfmpegPath: (path: string) => void
  };
}

declare module '@ffmpeg-installer/ffmpeg' {
  declare module.exports: { path: string, version: string, url: string };
}

declare module 'electron-json-storage' {
  declare module.exports: {
    set: (key: string, json: Object, callback: (err: ?Error) => mixed) => void,
    get: <T>(key: string, callback: (err: ?Error, state: T) => mixed) => void,
    has: (
      key: string,
      callback: (err: ?Error, exists: boolean) => mixed
    ) => void,
    getDataPath: () => string
  };
}

// A utility type for deeply nested $Shape
type $DeepShape<O: Object> = Object &
  $Shape<$ObjMap<O, (<V: Object>(V) => $DeepShape<V>) | (<V>(V) => V)>>;

declare module 'updeep' {
  declare module.exports: {
    <T>(update: $DeepShape<T>, object: T): T,
    omit: <T>(property: string, object: T) => T
  };
}

// Patch Flow's navigator type with MediaSession API
declare class MediaMetadata {
  constructor(args: {|
    title: string,
    artist: string,
    artwork: Array<{
      src: string,
      sizes?: string,
      type?: string
    }>
  |}): this;
}

declare var navigator: Navigator & {
  mediaSession: {
    metadata: MediaMetadata,
    playbackState: 'none' | 'paused' | 'playing',
    // TODO: the callback function for some events (e.g. the seeking ones) have optional / required parameters
    setActionHandler: (eventName: string, callback: Function) => void,
    // TODO: Chrome 81 will have this feature
    setPositionState: (stateDict?: {|
      duration?: number,
      playbackRate?: number,
      position?: number
    |}) => void
  }
};
