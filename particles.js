particlesJS("particles-js", {
  "particles": {
      "number": {
          "value": 455,
          "density": {
              "enable": true,
              "value_area": 789.1476416322727
          }
      },
      "color": {
          "value": "#b01212"
      },
      "shape": {
          "type": "circle",
          "stroke": {
              "width": 0,
              "color": "#000000"
          },
          "polygon": {
              "nb_sides": 5
          }
      },
      "opacity": {
          "value": 0.48,
          "random": false,
          "anim": {
              "enable": true,
              "speed": 0.1,
              "opacity_min": 0.1,
              "sync": false
          }
      },
      "size": {
          "value": 3,
          "random": true,
          "anim": {
              "enable": true,
              "speed": 1,
              "size_min": 0.5,
              "sync": false
          }
      },
      "line_linked": {
          "enable": false
      },
      "move": {
          "enable": true,
          "speed": 0.5,  // Reduced speed for slower movement
          "direction": "top-right",  // Gentle diagonal movement
          "random": true,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
              "enable": false
          }
      }
  },
  "interactivity": {
      "detect_on": "canvas",
      "events": {
          "onhover": {
              "enable": true,
              "mode": "bubble"
          },
          "onclick": {
              "enable": true,
              "mode": "push"
          },
          "resize": true
      },
      "modes": {
          "bubble": {
              "distance": 83.91608391608392,
              "size": 1,
              "duration": 3,
              "opacity": 1,
              "speed": 3
          },
          "push": {
              "particles_nb": 4
          }
      }
  },
  "retina_detect": true
});

document.addEventListener('DOMContentLoaded', () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const iframe = document.querySelector('iframe');
    const particlesContainer = document.getElementById('particles-js');

    // Beat detection algorithm
    const createBeatDetector = (audioElement) => {
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        let energy = 0;
        let prevEnergy = 0;
        let beatThreshold = 1.1; // Sensitivity for beat detection
        let lastBeatTime = Date.now();

        const particles = document.querySelectorAll('#particles-js .particle');

        const detectBeat = () => {
            analyser.getByteFrequencyData(dataArray);

            // Calculate energy (average amplitude)
            energy = dataArray.reduce((a, b) => a + b, 0) / bufferLength;

            // Beat detection logic
            if (energy > prevEnergy * beatThreshold && 
                Date.now() - lastBeatTime > 300) { // Prevent too frequent beats
                // Beat detected!
                particles.forEach((particle, index) => {
                    // Dramatic beat response
                    particle.style.transform = `scale(${1.5})`;
                    particle.style.opacity = 1;
                    particle.style.boxShadow = '0 0 20px rgba(176, 18, 18, 0.8)';

                    // Reset animation
                    setTimeout(() => {
                        particle.style.transform = 'scale(1)';
                        particle.style.opacity = 0.5;
                        particle.style.boxShadow = 'none';
                    }, 200);
                });

                lastBeatTime = Date.now();
            }

            prevEnergy = energy;
            requestAnimationFrame(detectBeat);
        };

        // Connect audio source
        const source = audioContext.createMediaElementSource(audioElement);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        detectBeat();
    };

    // Function to set up beat detection when Spotify iframe is ready
    const setupBeatDetection = () => {
        if (iframe) {
            // Create an audio element from the iframe
            const audioElement = document.createElement('audio');
            audioElement.src = iframe.src;
            
            audioElement.addEventListener('canplay', () => {
                createBeatDetector(audioElement);
            });
        }
    };

    // Spotify-specific interaction
    window.addEventListener('message', (event) => {
        if (event.data && event.data.method === 'play') {
            setupBeatDetection();
        }
    });

    // Fallback for immediate initialization
    setupBeatDetection();
});
