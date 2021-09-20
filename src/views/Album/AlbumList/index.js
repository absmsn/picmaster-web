import styles from "./index.module.scss";
import {connect} from "react-redux";
import {createRef, useEffect, useState} from "react";
import {Album, User} from "../../../common/api";
import {ADD_ALBUMS_BATCH, REMOVE_ALBUMS_BATCH, ADD_ALBUM} from "../../../common/actionTypes";
import withFlexGrid from "../../../components/FlexGrid";
import {Empty, Button, Modal, Input} from "antd";
import AlbumItem from "../../../components/AlbumItem";
import {PlusOutlined} from "@ant-design/icons";

const mapStateToProps = state => ({
  user: state.user,
  albums: state.albums.albums
});

const mapDispatchToProps = dispatch => ({
  addAlbum: album => {
    dispatch({
      type: ADD_ALBUM,
      payload: album
    })
  },
  addAlbumsBatch: albums => {
    dispatch({
      type: ADD_ALBUMS_BATCH,
      payload: albums
    });
  },
  removeAlbumsBatch: albums => {
    dispatch({
      type: REMOVE_ALBUMS_BATCH,
      payload: albums
    });
  }
});

let fetchAlbumsNum = 0;
let allAlbumsDrained = false;
const minGridColumn = 3;
const maxGridSize = 180;
const gapSize = 8;
const albumList = createRef();

function AlbumList(props) {
  let selectedAlbums = [];
  let [selecting, setSelecting] = useState(false);

  const fetchAlbumsInfo = (size, num) => {
    if (allAlbumsDrained)
      return;
    User.listAlbums(
      props.user.userID,
      fetchAlbumsNum,
      num
    ).then(res => {
      const albums = res.data;
      if (!albums || albums.length === 0) {
        allAlbumsDrained = true;
        return;
      }
      props.addAlbumsBatch(albums);
    });
    fetchAlbumsNum += num;
  }

  const onAlbumClicked = function (album) {
    props.onAlbumClicked && props.onAlbumClicked(album);
  }

  const onAlbumSelectChange = function (album, checked) {
    if (checked) {
      selectedAlbums.push(album);
    } else {
      let i = selectedAlbums.findIndex(a => album === a);
      if (i !== -1) {
        selectedAlbums.splice(i, 1);
      }
    }
  }

  const openCreateAlbumModal = function () {
    let albumName = "";
    const modal = Modal.info({
      title: "新建相册",
      content: (
        <div>
          <label>相册名称</label>
          <Input placeholder="输入相册名称" onChange={e => {
            albumName = e.target.value
          }}/>
        </div>
      ),
      onOk: () => {
        if (!albumName) return;
        Album.addAlbum(props.user.userID, albumName)
        .then(function (res) {
          props.addAlbum(res.data);
        }).catch(function (e) {
          console.log(e);
        });
      },
      onCancel: () => {
        modal.destroy();
      }
    });
  }

  useEffect(() => {
    const height = albumList.current.offsetHeight;
    const num = Math.ceil(height / props.gridSize) * props.gridNum;
    if (props.albums.length === 0 && !allAlbumsDrained) {
      fetchAlbumsInfo(props.gridSize, num);
    }
    props.onEntered && props.onEntered();
  }, []);

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
        <div className={styles.addAlbumArea}>
          <div className={styles.addAlbumBtn} onClick={openCreateAlbumModal}>
            <PlusOutlined />
          </div>
        </div>
      </div>
      <div className={styles.albumList} ref={albumList} style={{
        gridGap: gapSize + "px",
        gridTemplateColumns: `repeat(${props.gridNum},minmax(0,1fr))`
      }}>
        {props.albums.length > 0
          ? props.albums.map(album =>
            <div style={{height: props.gridSize+"px"}} key={album.albumID}>
              <AlbumItem album={album} selecting={selecting}
                onAlbumClicked={onAlbumClicked}
                onAlbumSelectChange={onAlbumSelectChange}/>
            </div>
          )
          : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
        }
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withFlexGrid(AlbumList, minGridColumn, maxGridSize, gapSize, albumList)
);