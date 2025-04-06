// Using globally loaded TensorFlow.js and handpose (from script tags)
export async function detectHand(player) {
    const video = document.getElementById('video');
    const canvas = document.getElementById('game');
    const statusEl = document.getElementById('status');
    const errorEl = document.getElementById('error');

    setInterval(async () => {
        try {
          const predictions = await model.estimateHands(video);
          if (predictions.length > 0) {
            const palmBase = predictions[0].landmarks[0];
            const x = canvas.width - (palmBase[0] * canvas.width / video.width);
            const y = palmBase[1] * canvas.height / video.height;
      
            // Гарын арын танилт
            const isHandOpen = predictions[0].handedness === 'Right' ? palmBase[1] < 200 : palmBase[1] > 200; // Жишээ логик
            if (isHandOpen) {
              player.moveTo(x, y);
            } else {
              player.targetX = player.x; // Зогсох
              player.targetY = player.y; // Зогсох
            }
          }
        } catch (error) {
          console.error("Error during hand detection:", error);
        }
      }, 100);
    
    try {
      statusEl.textContent = "Loading handpose model...";
      
      // Check if TensorFlow.js and handpose are loaded
      if (!window.tf) {
        throw new Error("TensorFlow.js is not loaded");
      }
      
      if (!window.handpose) {
        throw new Error("Handpose model is not loaded");
      }
      
      // Load the model
      const model = await window.handpose.load();
      statusEl.textContent = "Hand detection ready! Allow camera access when prompted.";
      
      // Get webcam access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480 
        } 
      });
      video.srcObject = stream;
      
      // Make video visible during development (can hide in production)
      video.style.display = "block";
      video.style.position = "absolute";
      video.style.bottom = "10px";
      video.style.right = "10px";
      video.style.width = "160px";
      video.style.height = "120px";
      video.style.transform = "scaleX(-1)"; // Mirror the video
      
      statusEl.textContent = "Playing! Move your hand to control the red ball.";
      
      // Wait for video to be ready
      return new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          
          // Start hand detection
          setInterval(async () => {
            try {
              const predictions = await model.estimateHands(video);
              if (predictions.length > 0) {
                // Use palm position (more stable)
                const palmBase = predictions[0].landmarks[0];
                
                // Map webcam coordinates to canvas coordinates
                const x = canvas.width - (palmBase[0] * canvas.width / video.width);
                const y = palmBase[1] * canvas.height / video.height;
                
                player.moveTo(x, y);
              }
            } catch (error) {
              console.error("Error during hand detection:", error);
            }
          }, 100);
          
          resolve();
        };
      });
    } catch (error) {
      console.error("Error setting up hand detection:", error);
      errorEl.textContent = "Error: " + error.message;
      statusEl.textContent = "Hand detection failed to load.";
    }
  }