import { Song, SongID, SortType } from './types';

export function getSongList(
  songs: Record<SongID, Song>,
  playlist: string | null,
  sort?: SortType
): Song[] {
  const songlist = Object.values(songs);
  const filtered =
    playlist != null
      ? songlist.filter((song: Song) => song.playlists.includes(playlist))
      : songlist;

  if (sort == null) {
    return filtered;
  }

  const sorted = filtered.sort((a, b) => {
    switch (sort.column) {
      case 'TITLE':
        return spaceship(a.title, b.title);
      case 'ARTIST':
        return spaceship(a.artist, b.artist);
      case 'DURATION':
        return spaceship(a.duration, b.duration);
      default:
        return spaceship(a.date, b.date);
    }
  });

  if (sort.direction) {
    return sorted.reverse();
  }

  return sorted;
}

function spaceship<T = number | string>(a: T, b: T) {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function formatDuration(duration: number): string {
  const min = (duration / 60) | 0;
  const sec = String(duration % 60 | 0).padStart(2, '0');
  return `${min}:${sec}`;
}

// Format: PT1H2M34S
export function parseDuration(iso: string): number {
  const matches = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (matches == null) {
    return 0;
  }

  return (
    Number(matches[1] || 0) * 3600 +
    Number(matches[2] || 0) * 60 +
    Number(matches[3] || 0)
  );
}

// As of 2019, the most viewed YouTube video has ~6B views.
// This method works up to billions, and should be enough.
export function readableViews(viewCount: number): string {
  const length = 0 | Math.log10(viewCount);

  if (length < 3) return '' + viewCount;
  if (length < 6)
    return (
      (0 | (viewCount / Math.pow(10, length - 2))) / Math.pow(10, 5 - length) +
      'K'
    );
  if (length < 9)
    return (
      (0 | (viewCount / Math.pow(10, length - 2))) / Math.pow(10, 8 - length) +
      'M'
    );
  return (
    (0 | (viewCount / Math.pow(10, length - 2))) / Math.pow(10, 11 - length) +
    'B'
  );
}
