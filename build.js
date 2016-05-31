var spawn = require('child_process').spawn

var chars = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
var len = chars.length
function spinner (fps, fn) {
  var frame = 0

  var t = setInterval(function () {
    fn(chars[frame++ % len])
  }, 1000 / fps)

  return {
    stop: function () { clearInterval(t) }
  }
}

function build (cb) {
  var p = spawn('node-gyp', ['rebuild'])

  if (process.stdout.isTTY) {
    var spin = spinner(15, function (c) {
      process.stdout.clearLine()
      process.stdout.cursorTo(0)
      process.stdout.write(c + ' building TraceView native bindings')
    })
  }

  p.on('close', function (err) {
    if (process.stdout.isTTY) {
      spin.stop()
      process.stdout.clearLine()
      process.stdout.cursorTo(0)
    }

    if (err) {
      console.warn('No compatible TraceView oboe library found, tracing disabled')
    } else {
      console.log('TraceView bindings built successfully')
    }

    cb()
  })
}

if ( ! module.parent) {
	build(function () {})
} else {
	module.exports = build
}
