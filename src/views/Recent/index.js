import styles from './index.module.scss';
import {connect} from "react-redux";
import {createRef, useEffect, useState} from "react";
import { User } from "../../common/api";
import {groupDataByDate, processPhotoInfo} from "../../common/utils";
import PhotoDetail from "../../components/PhotoDetail";
import {MERGE_PHOTO_GROUPS} from "../../common/actionTypes";
import { Empty } from "antd";
import PhotoItem from "../../components/PhotoItem";
import withFlexGrid from "../../components/FlexGrid";

const mapStateToProps = state => ({
  user: state.user,
  groups: state.photos.photoGroups
});

const mapDispatchToProps = dispatch => ({
  mergePhotoGroups: (newGroups, arrFn, keyFn) => {
    dispatch({
      type: MERGE_PHOTO_GROUPS,
      arrFn: arrFn,
      keyFn: keyFn,
      payload: newGroups
    });
  }
});

const minGridColumn = 3;
const maxGridSize = 160;
const gapSize = 4;
let allPhotosDrained = false; // 已获取完所有图片数据
let fetchedPicturesNum = 0;
const mainContainer = createRef();

function Recent(props) {
  let [activePhoto, setActivePhoto] = useState();

  const loadPhotosInfo = (size, num) => {
    User.listPhotos(
      props.user.userID,
      fetchedPicturesNum,
      num
    ).then((res => {
      if (res.data.length === 0) {
        allPhotosDrained = true;
        return;
      }
      for (let p of res.data) {
        p = processPhotoInfo(p, size, "webp");
      }
      let groups = groupDataByDate(res.data, p => p["modifiedTime"]);
      props.mergePhotoGroups(groups, g => g.data,g => g.title);
    }));
    fetchedPicturesNum += num;
  }

  useEffect(() => {
    // 初次图片加载
    const height = mainContainer.current.offsetHeight;
    const num = Math.ceil(height / props.gridSize) * props.gridNum;
    if (props.groups.length === 0 && !allPhotosDrained) {
      loadPhotosInfo(props.gridSize, num);
    }
  }, []);

  return <div className={styles.mainContainer} ref={mainContainer}>
    { activePhoto && <div className={styles.photoDetail}>
        <PhotoDetail url={activePhoto.photoUrl} onClose={() => setActivePhoto(null)}/>
      </div>
    }
    {
      props.groups.length > 0
        ? props.groups.map(group => (
          <div className={styles.photoGroup} key={group.title}>
            <div className={styles.groupTitle}>{group.title}</div>
            <div className={styles.photoList} style={{
              gridGap: gapSize + "px",
              gridTemplateColumns: `repeat(${props.gridNum},minmax(0,1fr))`,
            }}>
              {
                group.data.map(photo => <div style={{
                  height: props.gridSize + "px",
                }} key={photo.photoID}>
                  <PhotoItem photo={photo} onImageClick={setActivePhoto}/>
                </div>)
              }
            </div>
          </div>
        ))
        : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    }
  </div>
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withFlexGrid(Recent, minGridColumn, maxGridSize, gapSize, mainContainer)
);
