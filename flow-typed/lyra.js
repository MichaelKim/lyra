// @flow strict

// Technically, the callbacks with error parameters would be a union of
// [Error, void] and [void, Data], but I don't know how to type that properly.

declare module 'ytsr' {
  declare module.exports: {
    (
      searchString: string,
      options: ?{|
        +limit: number,
        +nextpageRef: string
      |}
    ): Promise<{|
      +query: string,
      +items: Array<{|
        +title: string,
        +link: string,
        +author: {|
          +name: string
        |},
        +thumbnail: string
      |}>
    |}>,
    getFilters: (
      searchString: string
    ) => Promise<
      Map<
        string,
        Array<{|
          +name: string,
          +ref: string,
          +active: boolean
        |}>
      >
    >
  };
}

declare module 'ytdl-core' {
  declare type Format = {
    +url: string
  };

  declare type Info = {|
    +video_id: string,
    +title: string,
    +author: {|
      +name: string
    |},
    +length_seconds: number,
    +player_response: {|
      +videoDetails: {|
        +viewCount: number,
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
      +id: string
    |}>,
    +formats: Array<Format>
  |};

  declare type Options = {
    +quality: 'highestaudio'
  };

  declare module.exports: {
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
  declare module.exports: <T>(update: $DeepShape<T>, object: T) => T;
}
