const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const ffmpeg = require('ffmpeg-static');

const heroVideo = path.join(__dirname, 'public', 'videos', 'hero', 'sd_hero1_720p.mp4');
const connectVideo = path.join(__dirname, 'public', 'videos', 'hands-connect-final2.mp4');

const heroFramesDir = path.join(__dirname, 'public', 'frames', 'hero');
const connectFramesDir = path.join(__dirname, 'public', 'frames', 'connect');

// Ensure output directories exist
[heroFramesDir, connectFramesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  } else {
    // clean directory
    fs.readdirSync(dir).forEach(file => fs.unlinkSync(path.join(dir, file)));
  }
});

function extractFrames(videoPath, outputDir, fps = 30) {
  return new Promise((resolve, reject) => {
    console.log(`Extracting frames from ${path.basename(videoPath)} at ${fps}fps...`);
    // Use .jpg to guarantee image sequence instead of animated webp
    const outputPath = path.join(outputDir, 'frame_%04d.jpg');
    
    // Command: ffmpeg -i video.mp4 -vf "fps=30" -q:v 5 output/frame_%04d.jpg
    const args = [
      '-i', videoPath,
      '-vf', `fps=${fps}`,
      '-q:v', '5', // quality scale for jpeg (2-5 is good, lower is better quality)
      outputPath
    ];

    const child = spawn(ffmpeg, args);

    child.stderr.on('data', data => {
      // uncomment to debug
      // console.log(data.toString());
    });

    child.on('close', code => {
      if (code === 0) {
        console.log(`Successfully extracted frames for ${path.basename(videoPath)}`);
        
        // Count files
        const files = fs.readdirSync(outputDir);
        console.log(`Generated ${files.length} frames in ${outputDir}`);
        resolve(files.length);
      } else {
        reject(new Error(`ffmpeg exited with code ${code}`));
      }
    });
  });
}

async function run() {
  try {
    const heroCount = await extractFrames(heroVideo, heroFramesDir, 30);
    // Write frame counts to a json file so our app knows how many frames exist
    fs.writeFileSync(path.join(heroFramesDir, 'meta.json'), JSON.stringify({ count: heroCount }));

    const connectCount = await extractFrames(connectVideo, connectFramesDir, 30);
    fs.writeFileSync(path.join(connectFramesDir, 'meta.json'), JSON.stringify({ count: connectCount }));

    console.log("All frame extractions complete!");
  } catch (e) {
    console.error("Extraction failed:", e);
  }
}

run();
