import {useEffect, useState} from "react";
import {getGridSizeNum} from "../../common/utils";

function withFlexGrid(Wrapped, minGridNum, maxGridSize, gapSize, gridRef) {
  return function (props) {
    let [gridSize, setGridSize] = useState(maxGridSize);
    let [gridNum, setGridNum] = useState(minGridNum); // 每列的图片数

    const updateGrid = () => {
      const width = gridRef.current.offsetWidth;
      const grid = getGridSizeNum(minGridNum, maxGridSize, gapSize, width);
      setGridSize(grid.gridSize);
      setGridNum(grid.gridNum);
    }

    useEffect(() => {
      updateGrid();
      window.addEventListener("resize", updateGrid);
      return function () {
        window.removeEventListener("resize", updateGrid);
      }
    }, []);

    return (
      <div style={{width: "100%", height: "100%"}}>
        {<Wrapped gridNum={gridNum} gridSize={gridSize} {...props}/>}
      </div>
    )
  }
}

export default withFlexGrid;