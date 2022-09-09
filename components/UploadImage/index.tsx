import { Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useCallback, useEffect, useState } from 'react';
import styles from './index.module.less';
import { compressImage, fileToURL, urlToImage } from '@/utils';
interface IProps {
  url: string;
  accept?: string;
  compress?: {
    size?: number;
    // quality?: number
  };
  onDelete?: () => void;
  onPreview?: () => void;
  customRequest?: (file: File) => void;
  beforeUpload?: (file: File) => boolean;
}
const UploadImage = (props: IProps) => {
  const { url, accept, compress, onPreview, onDelete, beforeUpload, customRequest } = props;
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(url);
  const uploadBtn = <div>{loading ? <LoadingOutlined /> : <PlusOutlined />}</div>;
  useEffect(() => {
    setImageUrl(url);
  }, [url]);
  const compressFile = async (
    file,
    compress: GetTypeByKey<IProps, 'compress'>,
  ): Promise<File | undefined> => {
    const maxSize = compress?.size || 500 * 1024;
    const url = await fileToURL(file.file);
    const img = await urlToImage(url);
    const resFile = await compressImage(img, maxSize / 1024, file.file.name, file.file.type);
    return resFile;
  };
  const customRequestHandle = async file => {
    setLoading(true);
    if (compress?.size) {
      let res = await compressFile(file, compress);
      res && (file.file = res);
    }
    customRequest && (await customRequest(file));
    setLoading(false);
  };
  const beforeUploadHandle = (file: File) => {
    if (beforeUpload) {
      return beforeUpload(file);
    }
    return true;
  };
  const prevImageHandle = e => {
    e.preventDefault();
    e.stopPropagation();
    if (onPreview && typeof onPreview === 'function') {
      onPreview();
      return;
    }
    let aTag = document.createElement('a');
    aTag.href = imageUrl;
    aTag.target = '_blank';
    aTag.click();
    aTag.parentNode?.removeChild(aTag);
  };
  const deleteHandle = e => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete && typeof onDelete === 'function') onDelete();
    else setImageUrl('');
  };
  const maskClickHandle = useCallback(e => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <Upload
      accept={accept}
      listType="picture-card"
      className={styles.uploader}
      multiple={false}
      fileList={[]}
      maxCount={1}
      customRequest={customRequestHandle}
      beforeUpload={beforeUploadHandle}
    >
      {imageUrl ? (
        <div className={styles.previewImageContainer}>
          <img src={imageUrl} />
          <div className={styles.maskContainer} onClick={maskClickHandle}>
            <svg
              onClick={prevImageHandle}
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="eye"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
            </svg>
            <svg
              onClick={deleteHandle}
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="delete"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path>
            </svg>
          </div>
        </div>
      ) : (
        uploadBtn
      )}
    </Upload>
  );
};
export default UploadImage;
