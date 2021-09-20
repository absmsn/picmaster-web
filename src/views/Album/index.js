import styles from './index.module.scss';
import {useState} from "react";
import {Breadcrumb} from "antd";
import {Link, Route, Switch, useHistory} from "react-router-dom";
import AlbumList from "./AlbumList";
import PhotoList from "./PhotoList";

function Album(props) {
  let history = useHistory();
  let [currentAlbum, setCurrentAlbum] = useState();

  const onAlbumClicked = function (album) {
    history.push(`/album/${album.albumID}`);
    setCurrentAlbum(album);
  }

  return <div className={styles.mainContainer}>
    <div className={styles.header}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/album">所有相册</Link>
        </Breadcrumb.Item>
        {
          currentAlbum && <Breadcrumb.Item>
            {currentAlbum.name}
          </Breadcrumb.Item>
        }
      </Breadcrumb>
    </div>
    <div className={styles.contentArea}>
      <Switch>
        <Route path="/album" exact>
          <AlbumList onEntered={() =>
            setCurrentAlbum(null)
          } onAlbumClicked={onAlbumClicked}/>
        </Route>
        <Route path="/album/:id">
          <PhotoList album={currentAlbum}/>
        </Route>
      </Switch>
    </div>
  </div>
}

export default Album;
