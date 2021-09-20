import styles from "./index.module.scss";

function PhotoItem(props) {
  const onImageClick = function () {
    props.onImageClick && props.onImageClick(props.photo);
  }

  return (
    <div className={styles.mainContainer}>
      <img alt="alt" src={props.photo.thumbnailUrl} onClick={()=> onImageClick(props.photo)}
        style={{ height: props.size + "px" }}/>
      <div className={styles.photoInfo}>
        <div className={styles.photoName} title={props.photo.photoName}>
          {props.photo.photoName}
        </div>
        <div className={styles.photoDate}>
          {(new Date(props.photo.modifiedTime)).toLocaleTimeString("zh-CN", {
            hour12: false,
            hour: "numeric",
            minute: "numeric"
          })}
        </div>
      </div>
    </div>
  )
}

export default PhotoItem;