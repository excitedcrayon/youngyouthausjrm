"use strict";

const Constants = {
    URL: location.origin,
    lessonsFolder: 'lessons',
    lessonVideoElem: document.querySelector('.lesson-videos'),
    videoElem: document.querySelector('.video-player video')
}

window.addEventListener('DOMContentLoaded', () => {
    try{
        new EAVideoLessons();
    }catch(e){}
})

class EAVideoLessons {
    constructor(){
        this.TIMER = 1000;
        this.URL = location.origin;
        this.lessonsFolder = 'lessons';
        this.lessonsVideoElem = document.querySelector('.lesson-videos');
        this.lessonWrapperElem = document.querySelector('.lesson-wrapper');
        this.videoElem = document.querySelector('.video-player video');
        this.loadingSpinner = document.querySelector('.loading-spinner');
        this.currentPlaying = document.querySelector('.currently-playing');
        this.search = document.querySelector('[name="search"]');

        this.main();
    }
    main(){
        this.getLessons();
        this.navigateLessons();
        this.searchFilterVideos();
    }
    getLessons(){
        fetch(`${Constants.URL}/getFiles.php`)
        .then(res => res.json())
        .then(files => {
            //console.log(files);
            if ( files.length > 0 ) {
    
                files.forEach(file => {
                    let span = document.createElement('span');
                    span.className = 'lesson';
                    span.textContent = file;
                    span.setAttribute('data-url', `${this.URL}/${this.lessonsFolder}/${file}`);
                    this.lessonWrapperElem.appendChild(span);
                });
    
                this.videoElem.src = `${Constants.URL}/${Constants.lessonsFolder}/${files[0]}`;

                this.currentPlayingTextContent(files[0]);
            } else {
                let span = document.createElement('span');
                span.className = 'no-lesson';
                span.textContent = 'No lessons';
                this.lessonWrapperElem.appendChild(span);
            }
        })
        .catch(err => console.log(err)); 
    }
    navigateLessons(){
        this.lessonsVideoElem.addEventListener('click', (e) => {
            let currentDataURL = e.target.getAttribute('data-url');
            this.resetVideoSource(currentDataURL);
            this.currentPlayingTextContent(e.target.textContent);
        });
    }
    resetVideoSource(url){
        this.loadingSpinner.style.display = 'block';
        setTimeout(() => {
            this.loadingSpinner.style.display = 'none';
        }, this.TIMER * 2.5);
        this.videoElem.src = null;
        this.videoElem.src = url.toString();
    }
    currentPlayingTextContent(content){
        this.currentPlaying.innerHTML = '';
        this.currentPlaying.innerHTML = `
            <span>Currently playing</span>
            <p>${content}</p>
        `;
    }
    searchFilterVideos(){
        if ( this.search != undefined ) {
            this.search.addEventListener('keyup', (e) => {
                let searchValue = this.search.value.toUpperCase();
                console.log(searchValue);
                const lessons = document.querySelectorAll('.lesson-videos .lesson');
                lessons.forEach(lesson => {
                    if ( lesson.textContent.toUpperCase().indexOf(searchValue) > -1 ) {
                        lesson.style.display = "";
                    } else {
                        lesson.style.display = "none"
                    }
                });
            });
        }
    }
}