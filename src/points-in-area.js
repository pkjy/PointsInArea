import * as turf from '@turf/turf'

export default class PointsInArea {
  constructor(config) {
    const { pointGap, polylineArray, polyline, gapUnits } = config
    this.pointGap = pointGap || 3
    this.polylineArray = polylineArray // 经纬度坐标点的数组 [[[ 110.088289, 27.504098 ],[ 110.086623, 27.505559 ],...]]
    this.gapUnits = gapUnits || 'kilometers'
    if (polyline) {
      // 描绘多边形的经纬度字符串
      // 不同的点用;分割
      // 不同的多边形区域，通过|分割 
      // e.g. '109.466941,26.831946;109.469596,26.832381;109.471567,26.833027|109.471963,26.833175;109.472047,26.833207;109.472336,26.833345'
      this.polyline = polyline
      const multiPloy = polyline.split('|')
      this.polylineArray = multiPloy.map(v => {
        let nerArr = v.split(';')
        nerArr = nerArr.map(v => v.split(','))
        nerArr = nerArr.map(v => [Number(v[0]), Number(v[1])])
        return nerArr
      })
    }
  }

  generatePointsWithinGrid(singlePloy) {
    const longitude = singlePloy.map(v => v[0])   //所有经度的数组 [110.058288,110.0606,110.061639,...]
    const latitude = singlePloy.map(v => v[1]) // 所有纬度的数组 [27.73632, 27.731306, 27.727857, 27.726446,...]

    const minLongitude = Math.min.apply(Math, longitude) // 最西边
    const maxLongitude = Math.max.apply(Math, longitude) // 最东边
    const minLatitude = Math.min.apply(Math, latitude) // 最南边
    const maxLatitude = Math.max.apply(Math, latitude) // 最北边

    // 3. 在东南西北里的矩形里面获取网格点（指定间距）
    const myBbox = [minLongitude, minLatitude, maxLongitude, maxLatitude]
    var cellSide = this.pointGap; // 距离 几公里打一个点
    var options = { units: this.gapUnits }; // 距离单位
    var pointInGrid = turf.pointGrid(myBbox, cellSide, options);
    return pointInGrid
  }

  filterPointWithinPolygon(pointInGrid, singlePloy) {
    // 4. 筛选出同时在平面数据里面的点
    const polygon = turf.lineToPolygon(turf.lineString(singlePloy))
    const ptsWithin = turf.pointsWithinPolygon(pointInGrid, polygon);
    return ptsWithin.features.map(v => v.geometry.coordinates)
  }

  run() {
    let result = []
    this.polylineArray.forEach(v => {
      const pointInGrid = this.generatePointsWithinGrid(v)
      result = result.concat(this.filterPointWithinPolygon(pointInGrid, v))
    })
    return result
  }
}
