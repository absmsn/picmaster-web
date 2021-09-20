import styles from "./index.module.scss";
import {Checkbox} from "antd";
import {useState, useEffect} from "react";

function AlbumItem(props) {
  let [selected, setSelected] = useState(false);

  useEffect(function () {
    if (!props.selecting) {
      setSelected(false);
    }
  }, [props.selecting]);

  const onAlbumClicked = () => {
    props.onAlbumClicked && props.onAlbumClicked(props.album);
  }

  const onAlbumSelectChange = function (album, checked) {
    setSelected(checked);
    if (props.onAlbumSelectChange) {
      props.onAlbumSelectChange(album, checked);
    }
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.albumCoverArea}>
        <img className={styles.albumCover} onClick={onAlbumClicked} alt=""/>
        <div className={styles.selectLayer}
             style={{
               display: props.selecting ? "" : "none",
               opacity: selected ? 1 : ""
             }}>
          <div className={styles.selectCheckbox}>
            <Checkbox checked={selected} onChange={e =>
              onAlbumSelectChange(props.album, e.target.checked)
            }/>
          </div>
        </div>
      </div>
      <div className={styles.albumInfo}>
        <div className={styles.albumName}>
          {props.album.name}
        </div>
        <div className={styles.albumCreateTime}>
          {"创建于" + (new Date(props.album.createTime)).toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}

export default AlbumItem;