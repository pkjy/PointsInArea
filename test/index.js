import PointsInArea from '../src/points-in-area.js'
import { readFile, writeFile } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

readFile(path.join(path.dirname(fileURLToPath(import.meta.url)),'input.txt'), 'utf8', (err, data) => {
  if (err) throw err
  const pta = new PointsInArea({ polyline: data, pointGap: '1' })
  const result = pta.run()
  console.log('result',result)
  writeFile('output.txt', JSON.stringify(result).replace(/\[/g, "{").replace(/\]/g, "}").replace(/\}\,/g, '},\n').replace(/\}\}/g, '},').replace(/\{\{/g, '{').replace(/\{/g, '').replace(/\}\,/g, '').replace(/\"\"\,/g, ''), e => { if (e) throw e; console.log('The file has been saved!'); })
})
