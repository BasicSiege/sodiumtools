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

// Audio Visualization Add-on
document.addEventListener('DOMContentLoaded', () => {
    const audioElement = document.querySelector('iframe');
    const particlesContainer = document.getElementById('particles-js');
    
    // Create Audio Context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Function to create audio visualizer
    const createAudioVisualizer = (stream) => {
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const particles = document.querySelectorAll('#particles-js .particle');
        
        const updateParticles = () => {
            analyser.getByteFrequencyData(dataArray);
            
            // Calculate average frequency
            const averageFrequency = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
            
            // Modify particle colors and sizes based on audio
            particles.forEach((particle, index) => {
                // Create a pulsing effect based on audio intensity
                const intensity = dataArray[index % bufferLength] / 255;
                particle.style.opacity = 0.3 + (intensity * 0.7);
                particle.style.transform = `scale(${1 + (intensity * 0.5)})`;
                
                // Glow effect
                if (intensity > 0.5) {
                    particle.style.boxShadow = `0 0 10px rgba(176, 18, 18, ${intensity})`;
                } else {
                    particle.style.boxShadow = 'none';
                }
            });
            
            requestAnimationFrame(updateParticles);
        };
        
        updateParticles();
    };
    
    // Check if audio is playing
    const checkAudioPlaying = () => {
        const iframe = document.querySelector('iframe');
        if (iframe) {
            // Listen for play event on Spotify iframe
            iframe.contentWindow.postMessage('{"method":"addEventListener","value":"play"}', '*');
            
            // Listen for messages from iframe
            window.addEventListener('message', (event) => {
                if (event.data && event.data.method === 'play') {
                    // Audio started playing
                    createAudioVisualizer();
                }
            });
        }
    };
    
    checkAudioPlaying();
});
