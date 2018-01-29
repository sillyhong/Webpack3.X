import './css/style.css'
import './css/box.less'
import './css/nav.scss'
{
    let str = 'hello weihong'
    document.getElementById('title').innerHTML = str
}

// $('#title').html('weihong')
const json = require('../config.json')
document.getElementById('json').innerHTML = json.name