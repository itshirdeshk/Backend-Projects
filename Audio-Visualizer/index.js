document.getElementById("audio").addEventListener("change", (event) => {
    // console.log(event);
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.addEventListener("load", (event) => {
        console.log(event);
        const arrayBuffer = event.target.result;

        const audioContext = new window.AudioContext();

        audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
            visualize(audioBuffer, audioContext);
        })
    })
})

function visualize(audioBuffer, audioContext) {
    const canvas = document.getElementById("canvas");
    canvas.height = 500;
    canvas.width = canvas.clientWidth;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    const frequencyData = new Uint8Array(analyser.frequencyBinCount)

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer
    source.connect(analyser)
    analyser.connect(audioContext.destination);
    source.start();

    const canvasContext = canvas.getContext("2d");


    const channelData = audioBuffer.getChannelData(0);

    const barWidth = canvas.width / frequencyData.length;

    const chunkSize = Math.ceil(channelData.length / frequencyData.length)


    function draw() {
        requestAnimationFrame(draw);
        canvasContext.fillStyle = "#facfde";
        canvasContext.fillRect(0, 0, canvas.width, canvas.height)

        analyser.getByteFrequencyData(frequencyData)

        for (let i = 0; i < frequencyData.length; i++) {
            canvasContext.fillStyle = `rgba(82, 113, 255, ${frequencyData[i] / 255})`;
            const chunk = channelData.slice(i * chunkSize, (i + 1) * chunkSize);

            const min = Math.min(...chunk) * 20;
            const max = Math.max(...chunk) * 20;

            canvasContext.fillRect(i * barWidth, canvas.height - frequencyData[i], barWidth - 1, frequencyData[i]);
        }
    }

    draw()
}