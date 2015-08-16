// Create an instance
var wavesurfer, wavesurfer2, wavesurfer3;

var waveSurfers = {
  surfers: [],
  setUniversalCursor: function() {
    var self = this;
    self.surfers.forEach(function(surfer) {
      var nonSurfs = self.surfers.filter(function(surf) { return surf !== surfer })
      surfer.on('seek', function(seek) {
        console.log(nonSurfs);
      });
    });
  }
};

var setDuration;
var maxDur;

window.onload = function () {

    WaveSurfer.create = function (params) {
      var wavesurfer = Object.create(WaveSurfer);
      wavesurfer.init(params);
      waveSurfers.surfers.push(wavesurfer);
      return wavesurfer
    }

    wavesurfer = WaveSurfer.create({
        container: document.querySelector('#wave1'),
        waveColor: 'red',
        progressColor: 'green'
    });

    wavesurfer2 = WaveSurfer.create({
        container: document.querySelector('#wave2'),
        waveColor: 'violet',
        progressColor: 'purple'
    });

    wavesurfer3 = WaveSurfer.create({
      container: document.querySelector('#wave3'),
      waveColor: 'yellow',
      progressColor: 'orange'
    });

    // Find max length of all wavesurfers
    function maxDuration(arr) {
      var max = Math.max.apply(Math, arr.map(function(surfer) { return surfer.getDuration() }));
      return arr.filter(function(surfer) { return surfer.getDuration() === max })[0];
    }

    maxDur = maxDuration(waveSurfers.surfers);

    function setDuration(surfer) {
      var length = surfer.getDuration() / maxDur.getDuration() * 998;
      surfer.container.childNodes[0].style.width = length.toString() + 'px';
      surfer.container.childNodes[0].childNodes[0].style.width = length.toString() + 'px';
      surfer.container.childNodes[0].childNodes[0].style.height = '128px';
      surfer.container.childNodes[0].childNodes[1].childNodes[0].style.width = length.toString() + 'px';
      surfer.container.childNodes[0].childNodes[1].childNodes[0].style.height = '128px';
      surfer.params.pixelRatio = 998 / length * 2;
    }

    function setSurfers() {
      waveSurfers.surfers.forEach(function(surfer) {
        setDuration(surfer);
      })
    }


    // Add timeline
    maxDur.on('ready', function() {
      var timeline = Object.create(WaveSurfer.Timeline);

      timeline.init({
        wavesurfer: maxDur,
        container: "#wave-timeline"
      })

      setSurfers();
    })

    // Load audio from URL
    wavesurfer.load('waves/stereo.mp3');

    wavesurfer2.load('waves/whoDisturbs.wav');

    wavesurfer3.load('waves/abuse.wav');

    // Play/pause on button press
    var playButton = document.querySelector('[data-action="play"]')

    waveSurfers.surfers.forEach(function(surfer) {
      playButton.addEventListener(
        'click', surfer.playPause.bind(surfer)
      )
    });

    // Drag'n'drop
    var toggleActive = function (e, toggle) {
        e.stopPropagation();
        e.preventDefault();
        toggle ? e.target.classList.add('wavesurfer-dragover') :
            e.target.classList.remove('wavesurfer-dragover');
    };

    var handlers = {
        // Drop event
        drop: function (e) {
            toggleActive(e, false);

            // Load the file into wavesurfer
            if (e.dataTransfer.files.length) {
                wavesurfer.loadBlob(e.dataTransfer.files[0]);
            } else {
                wavesurfer.fireEvent('error', 'Not a file');
            }
        },

        // Drag-over event
        dragover: function (e) {
            toggleActive(e, true);
        },

        // Drag-leave event
        dragleave: function (e) {
            toggleActive(e, false);
        }
    };

    var dropTarget = document.querySelector('#drop');
    Object.keys(handlers).forEach(function (event) {
        dropTarget.addEventListener(event, handlers[event]);
    });
};
