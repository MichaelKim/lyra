// @flow strict

import * as React from 'react';

import { useSelector, useToggle } from '../../hooks';

const DownloadQueue = () => {
  const dlQueue = useSelector(state => state.dlQueue);
  const dlProgress = useSelector(state => (0 | (state.dlProgress * 100)) / 100);
  const [showQueue, toggleQueue] = useToggle(false);

  return (
    <div className='dl-box'>
      {dlQueue.length > 0 && (
        <>
          <button className='download-btn' onClick={toggleQueue} />
          {showQueue && (
            <div className='dl-popover'>
              <h3>Download Queue</h3>
              <div>{dlProgress}%</div>
              {dlQueue.map(id => (
                <div key={id}>{id}</div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DownloadQueue;
