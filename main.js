// Fitluencer Group - Premium Interactivity

document.addEventListener('DOMContentLoaded', () => {
    // 0. Safety & Animation Init
    document.body.classList.add('js-enabled');
    
    // 긴급 안전장치: 2초 후 모든 reveal 요소를 강제 노출 (스크립트 꼬임 방지)
    setTimeout(() => {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
    }, 2000);

    try {
        /* 1. Header & Mobile Menu */
        const header = document.getElementById('main-header');
        const menuBtn = document.getElementById('mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');

        if (header) {
            window.addEventListener('scroll', () => {
                header.classList.toggle('scrolled', window.scrollY > 50);
            });
        }

        if (menuBtn && navLinks) {
            menuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }

        /* 2. YouTube API (Simplified & Robust) */
        const videoIds = ['jZBVrJRMx-U', 'jkT64wBTub8', 'KmcZptoUeSg']; 
        let currentVideoIndex = 0;
        let player;
        let apiLoaded = false;

        window.onYouTubeIframeAPIReady = function() {
            if (apiLoaded) return; // 중복 실행 방지
            apiLoaded = true;
            
            player = new YT.Player('player', {
                videoId: videoIds[currentVideoIndex],
                playerVars: {
                    'autoplay': 1,
                    'mute': 1,
                    'controls': 0,
                    'rel': 0,
                    'playsinline': 1,
                    'enablejsapi': 1
                },
                events: {
                    'onReady': (e) => {
                        e.target.mute();
                        e.target.playVideo();
                        updateVideoTitle();
                    },
                    'onStateChange': (e) => {
                        if (e.data === YT.PlayerState.PLAYING) {
                            hideLoadingPoster();
                        }
                        if (e.data === YT.PlayerState.ENDED) {
                            playNext();
                        }
                    },
                    'onError': () => {
                        // 재생 실패 시 3초 후 강제 전환
                        setTimeout(playNext, 3000);
                    }
                }
            });
        };

        function playNext() {
            currentVideoIndex = (currentVideoIndex + 1) % videoIds.length;
            if (player && player.loadVideoById) {
                player.loadVideoById(videoIds[currentVideoIndex]);
                updateVideoTitle();
            }
        }

        // Emergency Force Show: 3초 후 강제 로딩 화면 제거
        setTimeout(hideLoadingPoster, 3000);

        function hideLoadingPoster() {
            const poster = document.getElementById('loading-poster');
            if (poster) {
                poster.style.opacity = '0';
                setTimeout(() => { poster.remove(); }, 1000); // 완전히 제거
            }
        }

        // 재생 유도 레이어 클릭 핸들러
        const playOverlay = document.getElementById('play-overlay');
        if (playOverlay) {
            playOverlay.addEventListener('click', () => {
                if (player && player.playVideo) {
                    player.playVideo();
                    hideLoadingPoster();
                    playOverlay.remove(); // 클릭 시 레이어 제거
                }
            });
        }

        // API Script Loading
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        function updateVideoTitle() {
            const titleEl = document.getElementById('video-title');
            const titles = [
                "FITLUENCER GROUP: GLOBAL VISION", 
                "PREMIUM SOLUTION: CELL SCIENCE",
                "J. KEVIN'S WELLNESS PHILOSOPHY"
            ];
            if (titleEl) {
                titleEl.style.opacity = 0;
                setTimeout(() => {
                    titleEl.innerText = titles[currentVideoIndex];
                    titleEl.style.opacity = 1;
                }, 500);
            }
        }

        /* 3. Survey Modal Logic */
        const modal = document.getElementById('survey-modal');
        const openBtn = document.getElementById('open-survey');
        const closeBtn = document.querySelector('.close-modal');
        const steps = document.querySelectorAll('.survey-step');
        const optBtns = document.querySelectorAll('.opt-btn');
        const surveyForm = document.getElementById('consultation-form');
        const successMsg = document.getElementById('survey-success');

        const cardTrigger = document.getElementById('card-survey-trigger');

        if (openBtn) {
            openBtn.addEventListener('click', () => {
                if (modal) modal.style.display = 'block';
                resetSurvey();
            });
        }

        if (cardTrigger) {
            cardTrigger.addEventListener('click', () => {
                if (modal) modal.style.display = 'block';
                resetSurvey();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (modal) modal.style.display = 'none';
            });
        }

        window.addEventListener('click', (e) => {
            if (modal && e.target === modal) modal.style.display = 'none';
        });

        optBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const currentStep = btn.closest('.survey-step');
                const nextStepNum = parseInt(currentStep.dataset.step) + 1;
                
                currentStep.classList.remove('active');
                const nextStep = document.querySelector(`.survey-step[data-step="${nextStepNum}"]`);
                if (nextStep) nextStep.classList.add('active');
            });
        });

        if (surveyForm) {
            surveyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                surveyForm.classList.add('hidden');
                const activeH3 = document.querySelector('.survey-step.active h3');
                const activeP = document.querySelector('.survey-step.active .survey-desc');
                if (activeH3) activeH3.classList.add('hidden');
                if (activeP) activeP.classList.add('hidden');
                if (successMsg) successMsg.classList.remove('hidden');
                
                setTimeout(() => {
                    if (modal) modal.style.display = 'none';
                }, 3000);
            });
        }

        function resetSurvey() {
            steps.forEach(s => s.classList.remove('active'));
            if (steps[0]) steps[0].classList.add('active');
            if (surveyForm) surveyForm.classList.remove('hidden');
            if (successMsg) successMsg.classList.add('hidden');
            document.querySelectorAll('.survey-step h3, .survey-step .survey-desc').forEach(el => el.classList.remove('hidden'));
        }

        /* 4. Scroll Reveal (Intersection Observer) */
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

        /* 5. Floating Consultation Button */
        const floatingBtn = document.getElementById('floating-consult');
        if (floatingBtn) {
            floatingBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (modal) {
                    modal.style.display = 'block';
                    resetSurvey();
                }
            });
        }

        /* 6. Product Detail Buttons */
        const productBtns = document.querySelectorAll('.open-product-modal');
        productBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (modal) {
                    modal.style.display = 'block';
                    resetSurvey();
                }
            });
        });

    } catch (error) {
        console.error("Fitluencer Group Script Error:", error);
        // 오류 발생 시 모든 숨김 요소 강제 노출
        document.querySelectorAll('.reveal').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }
});
