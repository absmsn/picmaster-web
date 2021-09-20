import styles from "./index.module.scss";
import {connect} from "react-redux";
import {createRef, useEffect, useRef, useState} from "react";
import {ADD_PHOTOS_BATCH} from "../../../common/actionTypes";
import {processPhotoInfo} from "../../../common/utils";
import {Album, Photo} from "../../../common/api";
import PhotoItem from "../../../components/PhotoItem";
import withFlexGrid from "../../../components/FlexGrid";
import {Button} from "antd";
import {UploadOutlined} from "@ant-design/icons";

const mapStateToProps = (state, ownProps) => ({
  photos: state.photos.albumPhotos[ownProps.album.albumID] || []
});

const mapDispatchToProps = dispatch => ({
  addPhotosBatch: (albumID, photos) => {
    dispatch({
      type: ADD_PHOTOS_BATCH,
      payload: {
        photos: photos,
        albumID: albumID
      }
    });
  }
});

const minGridColumn = 3;
const maxGridSize = 160;
const gapSize = 6;
const photoList = createRef();

function PhotoList(props) {
  let fetchPhotosNum = 0;

  let [photosDrained, setPhotosDrained] = useState(false);
  let [selecting, setSelecting] = useState(false);
  let uploadInputRef = useRef();

  const fetchPhotosInfo = (size, num) => {
    if (photosDrained)
      return;
    Album.listPhotos(
      props.album.albumID,
      fetchPhotosNum,
      num,
    ).then(res => {
      const photos = res.data;
      if (photos.length < num) {
        setPhotosDrained(true);
      }
      for (let photo of photos) {
        photo = processPhotoInfo(photo, size, "webp");
      }
      props.addPhotosBatch(props.album.albumID, photos);
    });
    fetchPhotosNum += num;
  }

  const onFilesConfirmed = () => {
    let files = uploadInputRef.current.files;
    Promise.allSettled(Array.from(files).map(file => {
      return Photo.addPhoto(props.album.albumID, file, file.lastModified, e => {
        console.log(e);
      });
    })).then(function(results) {
      let successed = results
        .filter(r => r.status === 'fulfilled')
        .map(r => processPhotoInfo(r.value.data, props.gridSize, "webp"));
      props.addPhotosBatch(props.album.albumID, successed);
    });
  }

  function onPageScroll(e) {

  }

  useEffect(() => {
    const height = photoList.current.offsetHeight;
    const num = Math.ceil(height / props.gridSize) * props.gridNum;
    if (props.photos.length === 0 && !photosDrained) {
      fetchPhotosInfo(props.gridSize, num);
    }
    props.onEntered && props.onEntered(props.album);
  }, []);

  // useEffect(function() {
  //   photoList.current.addEventListener("scroll", onPageScroll);
  //   return function() {
  //     photoList.current.removeEventListener("scroll", onPageScroll);
  //   }
  // }, []);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.operateBar}>
        <div className={styles.actionGroup}
             style={{display: selecting ? "" : "none"}}>
          <Button className={styles.operateBtn} type="primary" size="small" danger>删除</Button>
        </div>
        <div className={styles.selectGroup}>
          <Button className={styles.operateBtn} type="primary" size="small" onClick={() => setSelecting(true)}>
            选择
          </Button>
          <Button className={styles.operateBtn} type="primary" size="small" onClick={() => setSelecting(false)}
                  style={{display: selecting ? "" : "none"}}>
            取消选择
          </Button>
        </div>
        <div className={styles.uploadPhotoArea}>
          <div className={styles.uploadPhotoBtn}>
            <input type="file" className={styles.uploadInput} multiple 
              onChange={ onFilesConfirmed } ref={uploadInputRef}/>
            <UploadOutlined/>
          </div>
        </div>
      </div>
      <div className={styles.photoListContainer}>
        <div className={styles.photoList} ref={photoList}
            style={{gridGap: gapSize + "px", gridTemplateColumns: `repeat(${props.gridNum},minmax(0,1fr))`}}>
          {props.photos.length > 0 && props.photos.length > 0 && props.photos.map(photo =>
            <div className={styles.photoItem} key={photo.photoID}>
              <PhotoItem photo={photo} size={props.gridSize}/>
            </div>
          )}
        </div>
        {
          photosDrained && <div className={styles.photoDrainedPropa}>
            已加载所有图片
          </div>
        }
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withFlexGrid(PhotoList, minGridColumn, maxGridSize, gapSize, photoList)
);