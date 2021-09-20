import styles from './index.module.scss';
import SideBar from '../SideBar';
import Recent from "../Recent";
import Album from "../Album";
import Header from "../Header";
import Favourite from "../Favourite";
import Dustbin from "../Dustbin";
import { Switch, Route } from "react-router-dom";

function MainPage(props) {
  return <div className={styles.mainContainer}>
    <div className={styles.header}><Header /></div>
    <div className={styles.sideBar}><SideBar /></div>
    <div className={styles.contentArea}>
      <Switch>
        <Route path="/" exact><Recent /></Route>
        <Route path="/recent"><Recent /></Route>
        <Route path="/album"><Album /></Route>
        <Route path="/favourite"><Favourite /></Route>
        <Route path="/dustbin"><Dustbin /></Route>
      </Switch>
    </div>
  </div>
}

export default MainPage;
