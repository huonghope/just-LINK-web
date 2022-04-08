import React, {useEffect, useState, useRef} from 'react';
import './style.scss';
import moment from 'moment';
import Avatar from '@material-ui/core/Avatar';
import Axios from 'axios';
import axios from 'axios';
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import utils from '../../../../../../constants/utils';

function FileComponent({type, resData}) {
  const [loaded, setLoaded] = useState(0);
  const [downloadPercentage, setDownloadPercentage] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const {data, sender} = resData;
  const isImage = data.file.mimetype.substring(0, 5) === 'image';
  const url = `${process.env.REACT_APP_SERVER_API}` + '/' + data.file.fileHash;
  const cancelToken = useRef(null);

  const handleUsername = (username) => {
    const nameArray = username.split(' ').filter((str) => {
      return str !== '';
    });
    // Korean name
    if (nameArray.length === 1) {
      const name = nameArray[0];
      const nameLength = nameArray[0].length;
      if (nameLength === 2) {
        return name;
      }
      else if (nameLength === 3) {
        return name.substring(1);
      }
      else {
        return name[0];
      }
    }
    // English name
    else {
      return nameArray[0][0] + nameArray[1][0];
    }
  };

  const handleTimestamp = (timestamp) => {
    const ltArray = timestamp.split(' ');
    ltArray[1] === 'AM' ? ltArray[1] = '오전' : ltArray[1] = '오후';
    return ltArray[1] + '\n' + ltArray[0];
  };

  const handleCancel = () => {
    if (cancelToken.current) {
      cancelToken.current.cancel();
      setTimeout(() => {
        setDownloadPercentage(100);
        setIsDownloading(false);
      }, 700);
    }
  };

  const handleDownload = async (data) => {
    setIsDownloading(true);

    cancelToken.current = axios.CancelToken.source();

    let total;
    axios.get(url, {
      onDownloadProgress: (progressEvent) => {
        setLoaded(progressEvent.loaded);
        total = progressEvent.total;

        setDownloadPercentage(Math.floor(loaded / total * 100));
      },
      responseType: 'blob',
      cancelToken: cancelToken.current.token,
    })
        .then((response) => {
          setLoaded(total);
          setDownloadPercentage(100);

          const url = window.URL.createObjectURL(
              new Blob([response.data], {
                type: response.headers['content-type'],
              }),
          );

          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', data.file.originalname);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setIsDownloading(false);
        });
  };

  const toMegabyte = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(1);
  };
  return (
    <div className="file-type">
      {
        type === 'other' &&
          <div className="file-type__avatar">
            <Avatar style={{backgroundColor: '#c0ccda', color: '#f6f7f9'}}>
              {handleUsername(sender.username)}
            </Avatar>
          </div>
      }
      <div className="file-type__message">
        <div className="file-type__message__left">
          {
            isImage ?
              <img
                src={url}
                style={{width: '144px', height: '144px', padding: '5px 0'}}
                alt="image-preview"
              /> :
              <p className="file-type__name">{data.file.originalname}</p>
          }

          <p className="file-type__size">
            용량 {isDownloading && (toMegabyte(loaded) + '/')}{utils.formatBytes(data.file.size)}
          </p>

          {
            !isDownloading ?
              <div className="file-type__save">
                <div
                  className="file-type__save__default"
                  onClick={() => {!isDownloading && handleDownload(data);}}
                >
                  저장
                </div>
                <div className="file-type__save__bar">|</div>
                <div
                  className="file-type__save__other"
                  onClick={() => {!isDownloading && handleDownload(data);}}
                >
                  다른이름으로 저장
                </div>
              </div> :
              <div
                className="file-type__cancel"
                onClick={() => {handleCancel();}}
              >
                취소
              </div>
          }

        </div>
        <div className="file-type__message__right">
          {
            !isImage &&
              <div
                className="file-type__progress-bar"
                style={{width: '30px', height: '30px'}}
                onClick={() => {isDownloading ? handleCancel() : handleDownload(data);}}
              >
                <CircularProgressbar
                  value={isDownloading ? downloadPercentage : 0}
                  text={isDownloading ? '✕': '↓'}
                  background={'#ffffff'}
                  styles={buildStyles({
                    textColor: '#2a2b37',
                    textSize: '58px',
                    backgroundColor: '#ffffff',
                    trailColor: !isDownloading ? '#c6d1dd' : '#ffffff',
                    pathColor: '#2a2b37',
                  })}
                />
              </div>
          }
        </div>
      </div>

      <div className="file-type__info">
        <span className="file-type__time">
          {handleTimestamp(moment(data.timestamp).format('LT'))}
        </span>
      </div>
    </div>
  );
}

export default FileComponent;
