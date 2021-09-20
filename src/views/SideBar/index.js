import {Tabs} from 'antd';
import './index.scss'
import {Link} from 'react-router-dom'

function SideBar(props) {
    return <div className="sideBar">
        <Tabs defaultActiveKey="1" tabPosition="left" style={{ height: 220 }}>
            <Tabs.TabPane tab={<Link to="/">最近查看</Link>} key={"recent"}/>
            <Tabs.TabPane tab={<Link to="/album">相册</Link>} key={"album"}/>
            <Tabs.TabPane tab={<Link to="/favourite">收藏</Link>} key={"favourite"}/>
            <Tabs.TabPane tab={<Link to="/dustbin">回收站</Link>} key={"trash"}/>
        </Tabs>
    </div>
}

export default SideBar;
