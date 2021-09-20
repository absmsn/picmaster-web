import styles from "./index.module.scss";
import { CloseOutlined } from "@ant-design/icons"

function PhotoDetail(props) {
  const close = function () {
    props.onClose && props.onClose();
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <div className={styles.closeBtnArea}>
          <div className={styles.closeBtnContainer} onClick={close}>
            <CloseOutlined className={styles.closeBtn}/>
          </div>
        </div>
      </div>
      <div className={styles.imageContainer}>
        <img src={props.url} className={styles.img} alt="img"/>
      </div>
      <div className={styles.footer}></div>
    </div>
  )
}

export default PhotoDetail;