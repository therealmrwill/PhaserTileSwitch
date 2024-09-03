





//Score Bar
document.addEventListener('score-change', (e) =>{
    const lightBar = document.querySelector('.percent.light');

    if(!lightBar) return;

    // console.log(`New Scores - (Dark: ${e.detail.darkScore}), (Light: ${e.detail.lightScore})`)


    var total = e.detail.lightScore + e.detail.darkScore;
    var lightPercent = (e.detail.lightScore / total) * 100;

    lightBar.style.width = lightPercent + '%';
})


//Play/Pause Button
document.querySelector('#play-pause').addEventListener('click', (e) =>{
    var target = document.querySelector('#play-pause');

    var nowPlaying = target.classList.contains('play');

    if(nowPlaying){
        target.innerHTML = "";
        target.classList.remove('play')
        target.classList.add('pause')

        const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svgElement.setAttribute('viewBox', '0 0 24 24');

        // Create the title element for accessibility
        const titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        titleElement.textContent = 'pause';

        // Create the path element for the pause icon
        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('d', 'M14,19H18V5H14M6,19H10V5H6V19Z');

        // Append the title and path elements to the SVG
        svgElement.appendChild(titleElement);
        svgElement.appendChild(pathElement);

        // Append the SVG to the play-pause div
        target.appendChild(svgElement);


        var playGameEvent = new CustomEvent('play-game');
        document.dispatchEvent(playGameEvent);
    }
    else{
        target.innerHTML = "";
        target.classList.remove('pause')
        target.classList.add('play')

        const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svgElement.setAttribute('viewBox', '2 2 20 20');

        // Create the title element for accessibility
        const titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        titleElement.textContent = 'play';

        // Create the path element for the play icon
        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('d', 'M8,5.14V19.14L19,12.14L8,5.14Z');

        // Append the title and path elements to the SVG
        svgElement.appendChild(titleElement);
        svgElement.appendChild(pathElement);

        // Append the SVG to the play-pause div
        target.appendChild(svgElement);


        var pauseGameEvent = new CustomEvent('pause-game');
        document.dispatchEvent(pauseGameEvent);
    }

})

//Reset Button
document.querySelector('#restart').addEventListener('click', (e) => {
    location.reload();
})