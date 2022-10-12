declare module 'points-in-area' {
  interface config {
    pointGap?: string | number
    polylineArray?: Array<Array<String>>
    polyline?: string
    gapUnits: 'degrees' | 'radians' | 'miles' | 'kilometers'
  }

  class PointsInArea {
    constructor(config: config)

    run(): Array<Array<String>>
  }

  export = PointsInArea
}