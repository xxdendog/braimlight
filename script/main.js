document.body.style.opacity = '1';
var preload = document.createElement('div');
preload.className = "preloader";
preload.innerHTML = '<div class="spinner"></div>';
document.body.appendChild(preload);

window.addEventListener('load', function() {
    preload.className +=  ' fade';
    setTimeout(function(){
        preload.style.display = 'none';
    },500);
})

var app = new PIXI.Application(window.innerWidth, window.innerHeight);
app.stage.interactive = true;
document.body.appendChild(app.view);

var posX, displacementSprite, displacementFilter, vx, windowAspect , imageAspect;
var body = document.body;
var texture = [];
var bg = [];
var container = new PIXI.Container();
app.stage.addChild(container);

if ( isPortrait() && isMobile()) {
    PIXI.loader
        .add("img/bg/ripple.png")
        .add("img/bg/mobile1.jpg")
        .add("img/bg/mobile2.jpg")
        .add("img/bg/mobile3.jpg")
        .add("img/bg/mobile4.jpg")
        .add("img/bg/mobile5.jpg")
        .add("img/bg/bg6.jpg")
        .load(setup);
} else  {
    PIXI.loader
        .add("img/bg/ripple.png")
        .add("img/bg/bg1.jpg")
        .add("img/bg/bg2.jpg")
        .add("img/bg/bg3.jpg")
        .add("img/bg/bg4.jpg")
        .add("img/bg/bg5.jpg")
        .add("img/bg/bg6.jpg")
        .load(setup);
}

function setup() {
    posX = app.renderer.width / 2;
    displacementSprite = new PIXI.Sprite(PIXI.loader.resources["img/bg/ripple.png"].texture);
    displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
    displacementSprite.anchor.set(0.5);
    displacementSprite.x = app.renderer.width / 2;
    displacementSprite.y = app.renderer.height / 2;
    vx = displacementSprite.x;

    app.stage.addChild(displacementSprite);
    container.filters = [displacementFilter];
    displacementFilter.scale.x = 0;
    displacementFilter.scale.y = 0;

    for (var i = 0; i < 2; i++) {
        if ( isPortrait() && isMobile()) {
            bg[i] = new PIXI.Sprite(PIXI.loader.resources["img/bg/mobile1.jpg"].texture);
        } else {
            bg[i] = new PIXI.Sprite(PIXI.loader.resources["img/bg/bg1.jpg"].texture);
        }

        bg[i].anchor.x = 0.5;
        bg[i].anchor.y = 0.5;
        bg[i].position.x = app.renderer.width / 2;
        bg[i].position.y = app.renderer.height / 2;

        windowAspect = app.renderer.width / app.renderer.height;
        imageAspect = bg[i].width / bg[i].height;

        if(windowAspect > imageAspect) {
            bg[i].height = app.renderer.width / imageAspect;
            bg[i].width = app.renderer.width;
        }else{
            bg[i].width = app.renderer.height * imageAspect;
            bg[i].height = app.renderer.height;
        }
        container.addChild(bg[i]);
    }

    if ( isPortrait() && isMobile()) {
        texture[0] = PIXI.Texture.from('img/bg/mobile1.jpg');
        texture[1] = PIXI.Texture.from('img/bg/mobile2.jpg');
        texture[2] = PIXI.Texture.from('img/bg/mobile3.jpg');
        texture[3] = PIXI.Texture.from('img/bg/mobile4.jpg');
        texture[4] = PIXI.Texture.from('img/bg/mobile5.jpg');
        texture[5] = PIXI.Texture.from('img/bg/bg6.jpg');
    } else {
        texture[0] = PIXI.Texture.from('img/bg/bg1.jpg');
        texture[1] = PIXI.Texture.from('img/bg/bg2.jpg');
        texture[2] = PIXI.Texture.from('img/bg/bg3.jpg');
        texture[3] = PIXI.Texture.from('img/bg/bg4.jpg');
        texture[4] = PIXI.Texture.from('img/bg/bg5.jpg');
        texture[5] = PIXI.Texture.from('img/bg/bg6.jpg');
    }

    bg[1].texture = texture[5];
    bg[0].texture = texture[document.body.dataset.mainImg];
    app.stage.on('mousemove', onPointerMove).on('touchmove', onPointerMove);
    loop();
}

function onPointerMove(eventData) {
    posX = eventData.data.global.x;
}

function loop() {
    requestAnimationFrame(loop);
    vx += (posX - displacementSprite.x) * 0.045;
    displacementSprite.x = vx;
    var disp = Math.floor(posX - displacementSprite.x);
    if (disp < 0) disp = -disp;

    if ( isPortrait() && isMobile()) {
        var fs = map(disp, 0, 800, 0, 400);
        disp = map(disp, 0, 300, 0.1, 0.7);
    } else {
        var fs = map(disp, 0, 500, 0, 120);
        disp = map(disp, 0, 500, 0.1, 0.6);
    }

    displacementSprite.scale.x = disp;
    displacementFilter.scale.x = fs;
}

map = function(n, start1, stop1, start2, stop2) {
    var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    return newval;
};

function transitionFilter() {
    vx = app.renderer.width;
    displacementSprite.x = app.renderer.width;
    posX = 0;
}

function transitionImage () {
    var scaleNumber;
    if ( isPortrait() && isMobile()) {
        scaleNumber = 1.2;
    } else {
        scaleNumber = 2.5;
    }
    var attributs = [];
    attributs[1] = { alpha : 1, scale : 1};
    attributs[0] = { alpha : 1, scale : scaleNumber};

    gsap.to(attributs[1], {
        duration: 2,
        alpha: 0,
        scale: bg[1].scale.x * scaleNumber,
        ease: easing,
        onUpdate: function () {
            bg[1].scale.x = attributs[1].scale;
            bg[1].scale.y = attributs[1].scale;
            bg[1].alpha = attributs[1].alpha;
        }
    });

    gsap.to(attributs[0], {
        duration: 2.5,
        alpha: 1,
        scale: bg[0].scale.x * 1.02,
        ease: easing,
        onUpdate: function () {
            bg[0].scale.x = attributs[0].scale;
            bg[0].scale.y = attributs[0].scale;
            bg[0].alpha = attributs[0].alpha;
        }
    });
}

var slider = document.getElementById("slider");
if(slider){
    var mySwiper = new Swiper(slider, {
        effect: 'fade',
        direction: 'vertical',
        speed: 1500,
        loop: true,
        mousewheel: true,
        navigation: {
            nextEl: '.slider-arrow-next',
            prevEl: '.slider-arrow-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        keyboard: {
            enabled: true,
            onlyInViewport: false,
        },
    });

    var previousIndex;
    function getPreviousIndex(){
        previousIndex = mySwiper.realIndex;
    }
    getPreviousIndex();

    mySwiper.on('slideChangeTransitionStart', function () {
        bg[1].texture = texture[previousIndex];
        bg[0].texture = texture[mySwiper.realIndex];

        transitionFilter();
        transitionImage()

        transitionTextActive(mySwiper.slides[mySwiper.activeIndex]);
        transitionTextPrev(mySwiper.slides[mySwiper.previousIndex]);

        if (mySwiper.realIndex === 3) {
            transitionTextPrev(mySwiper.slides[0]);
        } else if (mySwiper.realIndex === 0) {
            transitionTextPrev(mySwiper.slides[0]);
        }
        getPreviousIndex();
    });
}

var easing = 'Expo.easeOut';
var element1, element2, element3, element4, element5, element6;

function getElement(e){
        element1 = e.querySelectorAll('.title-1 .lines');
        element2 = e.querySelectorAll('.caption');
        element3 = e.querySelectorAll('.button-text');
        element4 = e.querySelectorAll('.title-1 .underline');
        element5 = e.querySelectorAll('.circle-2 circle');
        element6 = e.querySelectorAll('.circle-1 circle');
}

function transitionTextActive(e){
    gsap.timeline({
        smoothChildTiming : true,
        delay:.7
    })
        .fromTo('.swiper-slide-active .reveal .lines',{"--gradient-progress": "-150%","--gradient-progress-2": "0%"}, {"--gradient-progress": "100%","--gradient-progress-2": "200%", duration: 4, ease: easing, stagger: 0.07}, "<")
        .from('.swiper-slide-active .reveal .underline', {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 4, ease: easing, stagger: 0.07}, "<+.1")
        .from('.swiper-slide-active .reveal.caption', {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 4, ease: easing}, "<+.1")
        .from('.swiper-slide-active .button-text', {y: '-200%', duration: 1.4, ease:easing,}, "<")
        .from('.swiper-slide-active .circle-2 circle', {opacity: 0, duration: 4, ease:easing,}, "<")
        .fromTo('.swiper-slide-active .circle-1 circle', {drawSVG:"0%"}, {drawSVG:"100%", duration: 2, ease:easing,}, "<+.4");

    gsap.timeline({
        delay:.8
    })
        .from('.swiper-slide-active .wrapper', {y: '-7%', duration: 1.5, ease: easing});

}

function transitionTextPrev(e){
    /*
    getElement(e);
    gsap.timeline()
        .fromTo(element1, {y: '0'}, {y: '120%', duration: 1.4, ease:easing,})
        .fromTo(element2, {y: '0'}, {y: '120%', duration: 1.4, ease:easing,}, "<")
        .fromTo(element3, {y: '0'}, {y: '120%', duration: 1.4, ease:easing,}, "<")
        .fromTo(element4, {scaleY: 1}, {scaleY: 0, duration: 1.5, ease:easing,}, "<")
        .fromTo(element5, {opacity: 1}, {opacity: 0, duration: 1.5, ease:easing,}, "<")
        .fromTo(element6, {drawSVG:"100%"}, {drawSVG:"100% 100%", duration: .5, ease:easing,}, "<");

     */
}

function hasClass(element, className) {
    return (' ' + element.className + ' ').indexOf(' ' + className+ ' ') > -1;
}

function isPortrait() {
    return window.innerHeight > window.innerWidth;
}

function isMobile() {
    return window.innerWidth <= 768;
}

function setWindowHeight(){
    var windowHeight = window.innerHeight;
    var item =  document.querySelectorAll(".open-page");
    item.forEach(function(e){
        e.style.height = windowHeight + "px";
    })
}
setWindowHeight();

if ( !isPortrait() && !isMobile()) {
    window.addEventListener("resize",setWindowHeight,false);
}

var menu = document.querySelector('.menu-main'),
    menuLi = menu.querySelectorAll('.menu-main li'),
    menuLang = document.querySelector('.menu-lang'),
    menuTop = document.querySelectorAll('.menu-top li'),
    menuLine = menu.querySelectorAll('.menu-main li .line'),
    canvas = document.getElementsByTagName('canvas'),
    navigation = document.querySelector('.navigation'),
    iconLine1 = document.querySelector('.menu-icon-line:nth-child(1)'),
    iconLine2 = document.querySelector('.menu-icon-line:nth-child(2)'),
    iconLine3 = document.querySelector('.menu-icon-line:nth-child(3)');

tlMenu = gsap.timeline({ paused: true});

tlMenuIcon = gsap.timeline({ paused: true});
tlMenuIcon
    .to(iconLine1, {yPercent: 250, duration: .7, ease:easing,})
    .to(iconLine3, {yPercent: -220, duration: .7, ease:easing}, "<")
    .to(iconLine2, {opacity: 0, duration: 0.1}, "<")
    .to(iconLine1, {rotate: '45deg', duration: .7, ease:easing,}, "<+.4")
    .to(iconLine3, {rotate: '-45deg', duration: .7, ease:easing,}, "<");

if ( isPortrait() && isMobile()) {
    tlMenu
        .fromTo(navigation, {x: '100%'},{x: '0%', duration: .7, ease:easing}, "<")
        .fromTo(menuLang, { x: "10%" , opacity: 0}, {  x: "0%", opacity: 1, duration: 2, ease: easing}, "<+.15")
        .fromTo(menuLi, { x: "10%" , opacity: 0}, {  x: "0%", opacity: 1, duration: 2, ease: easing, stagger: .07 }, "<+.1")
        .fromTo(menuLine, { scaleX: 0, opacity: 0}, {  scaleX: 1, opacity: 1, duration: 2, ease: easing, stagger: .07 }, "<+.05")
        .fromTo(menuTop, { x: "10%" , opacity: 0}, {  x: "0%", opacity: 1, duration: 2, ease: easing, stagger: .07 }, "<+.3")
        .fromTo(canvas, { x: '0%'}, {  x: '-15%', duration: 2, ease: easing }, "+=");
} else {
    tlMenu
        .fromTo(menu, {x: '100%'},{x: '0%', duration: .7, ease:easing}, "<")
        .fromTo(menuLi, { x: "10%" , opacity: 0}, {  x: "0%", opacity: 1, duration: 2, ease: easing, stagger: .07 }, "<+.15")
        .fromTo(menuLine, { scaleX: 0, opacity: 0}, {  scaleX: 1, opacity: 1, duration: 2, ease: easing, stagger: .07 }, "<+.05")
        .fromTo(canvas, { x: '0%'}, {  x: '-15%', duration: 2, ease: easing }, "+=");
}

document.querySelector('.menu-icon, .menu-main-link').addEventListener('click', function () {
    menu.classList.toggle('is-open');
    body.classList.toggle('fixed');
    if (hasClass(menu, 'is-open')) {
        tlMenu.timeScale(1).play();
        tlMenuIcon.play();
    } else {
        tlMenu.timeScale(1.5).reverse();
        tlMenuIcon.reverse();
    }
});

window.addEventListener("orientationchange", function() {
    document.location.reload();
});

window.addEventListener('scroll', function() {

    var scrollTop = window.pageYOffset * 1.2,
        overlay = document.getElementById("overlay"),
        overlayHeight = overlay.offsetHeight;

    overlay.style.opacity =  1 - (overlayHeight - scrollTop) / overlayHeight;

    var rotateScroll = document.querySelectorAll('.rotate-on-scroll');

    rotateScroll.forEach(function(el){
        el.style.transform = "rotate(" + scrollTop/4 + "deg)";
    });
});

window.addEventListener("DOMContentLoaded", function() {

    var circleText = document.querySelectorAll('.circle-text');
    circleText.forEach(function(el){
        new CircleType(el);
    });
});

window.onload = function() {

    new SplitText(".split-line", {type: "lines", linesClass: "lines"});
    new SplitText(".split-text", {type: "lines", linesClass: "lines"});

    function underline(selector){

        var element = document.querySelectorAll(selector);
        element.forEach(function(e){
            let child = document.createElement("div");
            child.classList.add('underline');
            e.appendChild(child);
        });
    }

    underline('.split-line .lines');

    function wrap(selector){
        var overflow = document.querySelectorAll(selector);
        overflow.forEach(function(el){
            el.outerHTML = "<div class='overflow'>" + el.outerHTML + "</div>";
        });
    }
    wrap('.swiper-slide .caption');
    wrap('.swiper-slide .lines');

    transitionFilter();
    transitionImage();

    if ( isPortrait() && isMobile()) {
        gsap.from('.header .logo,\n' +
            '.header .menu-icon,\n' +
            '.swiper-pagination,\n' +
            '.pagination-line,\n' +
            '.slider-arrows', {
            opacity: 0,
            duration: 6,
            delay: 1.5,
            ease: easing
        });

        gsap.from('.header .line', {
            scaleX: 0,
            opacity: 0,
            duration: 2,
            delay: 1.5,
            ease: easing
        });
    } else {
        gsap.from('.header .logo,\n' +
            '.header .menu-icon,\n' +
            '.menu-lang,\n' +
            '.menu-top,\n' +
            '.swiper-pagination,\n' +
            '.pagination-line,\n' +
            '.slider-arrows', {
            opacity: 0,
            duration: 6,
            delay: 1.5,
            ease: easing
        });
    }


    var slider = document.getElementById("slider");
    if (slider) {

        gsap.timeline({
            delay:.7
        })
            .from('.swiper-slide-active .reveal .lines', {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 4, ease: easing, stagger: 0.07}, "<")
            .from('.swiper-slide-active .reveal .underline', {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 4, ease: easing, stagger: 0.07}, "<+.1")
            .from('.swiper-slide-active .reveal.caption', {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 4, ease: easing}, "<+.1")
            .from('.swiper-slide-active .button-text', {y: '-200%', duration: 1.4, ease:easing,}, "<")
            .from('.swiper-slide-active .circle-2 circle', {opacity: 0, duration: 4, ease:easing,}, "<")
            .fromTo('.swiper-slide-active .circle-1 circle', {drawSVG:"0%"}, {drawSVG:"100%", duration: 2, ease:easing,}, "<+.4");

        gsap.timeline({
            delay:.7
        })
            .from('.swiper-slide-active .wrapper', {y: '-7%', duration: 1.5, ease: easing});

        if ( !isPortrait() && !isMobile()) {
            var magnetic = document.querySelectorAll('.magnetic, .swiper-pagination-bullet, .slider-arrow');

            var options = {
                ease: 0.1,
                magneticForce: 0.6
            };

            var mouse = {
                x: 0,
                y: 0
            };

            magnetic.forEach(function(el){
                var pos = {
                    cx: 0,
                    cy: 0,
                    tx: 0,
                    ty: 0,
                    x: 0,
                    y: 0
                };
                var sizes = el.getBoundingClientRect();
                observe();
                update();
                function observe(){
                    window.addEventListener('resize', resizeHandler, false);
                    el.addEventListener('mousemove', mouseMoveHandler, false);
                    el.addEventListener('mouseleave', mouseLeaveHandler, false);
                }
                function resizeHandler(){
                    sizes = el.getBoundingClientRect();
                }
                function mouseMoveHandler(e){
                    mouse.x = e.pageX;
                    mouse.y = e.pageY;

                    pos.cx = sizes.left + ( sizes.width / 2 );
                    pos.cy = sizes.top + ( sizes.height / 2 );

                    var distX = ( mouse.x - sizes.left ) - ( sizes.width / 2 );
                    var distY = ( mouse.y - sizes.top ) - ( sizes.height / 2 );
                    pos.tx = distX - ( distX * (1 - options.magneticForce) );
                    pos.ty = distY - ( distY * (1 - options.magneticForce) );
                }
                function mouseLeaveHandler(e){
                    pos.tx = 0;
                    pos.ty = 0;
                }
                function render(){
                    pos.x += (pos.tx - pos.x) * options.ease;
                    pos.y += (pos.ty - pos.y) * options.ease;
                    el.style.transform = 'translateX(' +  pos.x + 'px) translateY(' + pos.y + 'px)';
                }
                function update(){
                    render();
                    window.requestAnimationFrame(update);
                }
            })
        }
    }

    var openPage = document.querySelector('.open-page');
    if (openPage) {

        gsap.timeline({
            delay:.7
        })
            .from('.open-page .reveal .lines', {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 4, ease: easing, stagger: 0.07}, "<")
            .from('.open-page .reveal .underline', {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 4, ease: easing, stagger: 0.07}, "<+.1")
            .from('.open-page .reveal.caption', {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 6, ease: easing}, "<+.1");

        gsap.timeline({
            delay:.7
        })
            .from('.open-page', {y: '-7%', duration: 1.5, ease: easing});

        gsap.timeline({
            delay:1.5,
        })
            .from('.open-page .scroll-down',{opacity: 0, duration: 4, ease: easing})
            .to('.open-page .rotate-on-scroll .inner',{rotate: '360deg', duration: 4, ease: easing}, "<")
            .from('.open-page .scroll-arrow',{rotationY:-90, duration: 3, ease: easing}, "<+.2");

        ScrollTrigger.batch(".white-theme-trigger", {
            start: "top 60%",
            end: "bottom 60%",
            toggleClass: {targets: body, className: "white-theme"}
        });

        gsap.utils.toArray(".section-head").forEach(function(e) {

            let element1 = e.querySelectorAll('.line'),
                element2 = e.querySelectorAll('.reveal .lines'),
                element3 = e.querySelectorAll('.reveal .underline'),
                element4 = e.querySelectorAll('.split-text .lines');

            gsap.timeline({
                scrollTrigger: {
                    trigger: e,
                    start: "20% bottom",
                    end: "bottom endAnimation",
                    scrub: true,
                }
            })
                .from(element1,{scaleX: 0, opacity: 0, duration: 2, ease: easing})
                .from(element2, {"--gradient-progress": "-100%","--gradient-progress-2": "0%","--gradient-angle": "135deg", duration: 2, ease: easing, stagger: 0.07}, "<+.7")
                .from(element3, {"--gradient-progress": "-100%","--gradient-progress-2": "0%", duration: 2, ease: easing, stagger: 0.07}, "<.05")
                .from(element4,{opacity: 0, duration: 2, ease: easing, stagger: 0.07}, "<+.2");
        });

        gsap.utils.toArray(".content-1-item").forEach(function(e) {

            let element1 = e.querySelectorAll('.line'),
                element2 = e.querySelectorAll('.line-vertical'),
                element3 = e.querySelectorAll('.reveal.caption'),
                element4 = e.querySelectorAll('.reveal .lines'),
                element5 = e.querySelectorAll('.reveal .underline'),
                element6 = e.querySelectorAll('.img-container'),
                element7 = e.querySelectorAll('.reveal-img'),
                element8 = e.querySelectorAll('.title-3, .split-text .lines'),
                element9 = e.querySelectorAll('.list li');

            if ( isPortrait() && isMobile()) {

                gsap.timeline({
                    scrollTrigger: {
                        trigger: e,
                        start: "20% bottom",
                        end: "bottom top",
                        scrub: true,
                    }
                })
                    .from(element1,{scaleX: 0, opacity: 0, duration: 2, ease: easing})
                    .from(element3, {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 2, ease: easing}, "<+.2")
                    .from(element4, {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 2, ease: easing, stagger: 0.07}, "<")
                    .from(element5, {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 2, ease: easing, stagger: 0.07}, "<+.1")
                    .from(element6,{width: '0', duration: 2, ease: easing}, "<+.2")
                    .from(element7, {"--gradient-end-opacity": "1", duration: 1, ease: easing}, "<")
                    .from(element7, {"--gradient-start-opacity": "1", duration: 1, ease: easing}, "<+.2")
                    .from(element8,{opacity: 0, duration: 2, ease: easing, stagger: 0.07}, "<+.9");

                gsap.timeline({
                    scrollTrigger: {
                        trigger: element9,
                        start: "20% bottom",
                        end: "bottom top",
                        scrub: true,
                    }
                })
                    .from(element9,{opacity: 0, duration: 2, ease: easing, stagger: 0.07}, "<+.3");

            } else {
                gsap.timeline({
                    scrollTrigger: {
                        trigger: e,
                        start: "20% bottom",
                        end: "bottom top",
                        scrub: true,
                    }
                })
                    .from(element1,{scaleX: 0, opacity: 0, duration: 2, ease: easing})
                    .from(element2,{scaleY: 0, opacity: 0, duration: 2, ease: easing}, "<+.2")
                    .from(element3, {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 2, ease: easing}, "<+.2")
                    .from(element4, {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 2, ease: easing, stagger: 0.07}, "<")
                    .from(element5, {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 2, ease: easing, stagger: 0.07}, "<+.1")
                    .from(element6,{width: '0', duration: 2, ease: easing}, "<-.1")
                    .from(element7, {"--gradient-end-opacity": "1", duration: 1, ease: easing}, "<")
                    .from(element7, {"--gradient-start-opacity": "1", duration: 1, ease: easing}, "<+.2")
                    .from(element8,{opacity: 0, duration: 2, ease: easing, stagger: 0.07}, "<+.1");

                gsap.timeline({
                    scrollTrigger: {
                        trigger: element9,
                        start: "20% bottom",
                        end: "bottom top",
                        scrub: true,
                    }
                })
                    .from(element9,{opacity: 0, duration: 2, ease: easing, stagger: 0.07}, "<+.8");
            }
        });

        gsap.utils.toArray(".content-2-item").forEach(function(e) {

            let element1 = e.querySelectorAll('.img-big'),
                element2 = e.querySelectorAll('.img-small'),
                element3 = e.querySelectorAll('.reveal.caption'),
                element4 = e.querySelectorAll('.reveal .lines'),
                element5 = e.querySelectorAll('.reveal .underline'),
                element6 = e.querySelectorAll('.split-text .lines, .list li'),
                element7 = e.querySelectorAll('.reveal-img');

            if ( isPortrait() && isMobile()) {

                gsap.timeline({
                    scrollTrigger: {
                        trigger: e,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                    }
                })
                    .from(element3, {opacity: 0, duration: 4, ease: easing, stagger: 0.07}, "<")
                    .from(element4, {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 4, ease: easing, stagger: 0.07}, "<")
                    .from(element5, {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 4, ease: easing, stagger: 0.07}, "<+.1")
                    .from(element6,{opacity: 0, duration: 2, ease: easing, stagger: 0.07}, "<+.5")
                    .from(element1,{width: '0', duration: 2, ease: easing}, "<+.7")
                    .from(element2,{width: '0', duration: 2, ease: easing}, "<")
                    .from(element7, {"--gradient-end-opacity": "2", duration: 2, ease: easing}, "<")
                    .from(element7, {"--gradient-start-opacity": "2", duration: 2, ease: easing}, "<+.2");

                gsap.to(element2, {
                    yPercent: -100,
                    ease: "none",
                    scrollTrigger: {
                        trigger: e,
                        scrub: true
                    },
                });

            } else {
                gsap.timeline({
                    scrollTrigger: {
                        trigger: e,
                        start: "20% bottom",
                        end: "bottom top",
                        scrub: true,
                    }
                })
                    .from(element1,{width: '0', duration: 2, ease: easing}, "<+1.1")
                    .from(element2,{width: '0', duration: 2, ease: easing}, "<")
                    .from(element7, {"--gradient-end-opacity": "2", duration: 2, ease: easing}, "<")
                    .from(element7, {"--gradient-start-opacity": "2", duration: 2, ease: easing}, "<+.2")
                    .from(element3, {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 4, ease: easing, stagger: 0.07}, "<")
                    .from(element4, {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 4, ease: easing, stagger: 0.07}, "<")
                    .from(element5, {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 4, ease: easing, stagger: 0.07}, "<+.1")
                    .from(element6,{opacity: 0, duration: 2, ease: easing, stagger: 0.07}, "<+.5");

                gsap.to(element1, {
                    yPercent: -50,
                    ease: "none",
                    scrollTrigger: {
                        trigger: e,
                        scrub: true
                    },
                });

                gsap.to(element2, {
                    yPercent: -200,
                    ease: "none",
                    scrollTrigger: {
                        trigger: e,
                        scrub: true
                    },
                });
            }
        });

        gsap.utils.toArray(".content-3-item").forEach(function(e) {

            let element1 = e.querySelectorAll('.line'),
                element2 = e.querySelectorAll('.img-container'),
                element3 = e.querySelectorAll('.reveal.caption'),
                element4 = e.querySelectorAll('.reveal .lines'),
                element5 = e.querySelectorAll('.reveal .underline'),
                element6 = e.querySelectorAll('.reveal-img'),
                element7 = e.querySelectorAll('.title-3, .split-text .lines, .icon-clock'),
                element8 = e.querySelectorAll('.list li'),
                element9 = e.querySelectorAll('.wrapper-1');

            if ( isPortrait() && isMobile()) {
                gsap.timeline({
                    scrollTrigger: {
                        trigger: e,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                    }
                })
                    .from(element3, {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 4, ease: easing}, "<+.5")
                    .from(element4, {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 4, ease: easing, stagger: 0.07}, "<")
                    .from(element5, {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 4, ease: easing, stagger: 0.07}, "<+.1")
                    .from(element7,{opacity: 0, duration: 2, ease: easing, stagger: 0.07}, "<+.3")
                    .from(element8,{opacity: 0, duration: 2, ease: easing, stagger: 0.07}, "<+.7")
                    .from(element2,{width: '0', duration: 2, ease: easing}, "<+.4")
                    .from(element6, {"--gradient-end-opacity": "2", duration: 2, ease: easing}, "<")
                    .from(element6, {"--gradient-start-opacity": "4", duration: 2, ease: easing}, "<")
                    .from(element1,{scaleX: 0, opacity: 0, duration: 2, ease: easing}, "<-.1");


            } else {
                gsap.timeline({
                    scrollTrigger: {
                        trigger: e,
                        start: "20% bottom",
                        end: "bottom top",
                        scrub: true,
                    }
                })
                    .from(element1,{scaleX: 0, opacity: 0, duration: 2, ease: easing})
                    .from(element2,{width: '0', duration: 2, ease: easing}, "<")
                    .from(element3, {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 2, ease: easing}, "<+.4")
                    .from(element4, {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 2, ease: easing, stagger: 0.07}, "<")
                    .from(element5, {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 2, ease: easing, stagger: 0.07}, "<+.1")
                    .from(element6, {"--gradient-end-opacity": "2", duration: 2, ease: easing}, "<")
                    .from(element6, {"--gradient-start-opacity": "4", duration: 2, ease: easing}, "<")
                    .from(element7,{opacity: 0, duration: 2, ease: easing, stagger: 0.07}, "<+.6")
                    .from(element8,{opacity: 0, duration: 2, ease: easing, stagger: 0.07}, "<");

                gsap.to(element9, {
                    yPercent: -100,
                    ease: "none",
                    scrollTrigger: {
                        trigger: e,
                        scrub: true
                    },
                });
            }
        });

        gsap.utils.toArray(".content-4-item").forEach(function(e) {

            let element1 = e.querySelectorAll('.img-container'),
                element2 = e.querySelectorAll('.title-3, .split-text .lines, li');

            gsap.timeline({
                scrollTrigger: {
                    trigger: e,
                    start: "20% bottom",
                    end: "bottom 45%",
                    scrub: true,
                }
            })
                .from(element1,{width: '0', duration: 2, ease: easing}, "<")
                .from(element1, {"--gradient-end-opacity": "2", duration: 2, ease: easing}, "<")
                .from(element1, {"--gradient-start-opacity": "4", duration: 2, ease: easing}, "<+.2")
                .from(element2,{opacity: 0, duration: 1, ease: easing, stagger: 0.07}, "<+.6");
        });
    }

    var textPage = document.querySelector(".text-head");
    if (textPage) {
        gsap.timeline({
            delay:.7
        })
            .from('.text-head .reveal .lines', {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 4, ease: easing, stagger: 0.07}, "<")
            .from('.text-head .reveal .underline', {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 4, ease: easing, stagger: 0.07}, "<+.1")
            .from('.text-head .reveal.caption', {"--gradient-progress": "-150%","--gradient-progress-2": "0%", duration: 6, ease: easing}, "<+.1")
            .from('.text-head .line',{scaleX: 0, opacity: 0, duration: 2, ease: easing}, "+=")
            .from('.section-text, .footer',{opacity: 0, duration: 4, ease: easing}, "+1");

        gsap.timeline({
            delay:.7
        })
            .from('.text-head .wrapper', {y: '-7%', duration: 1.5, ease: easing});

        gsap.timeline({
            delay:1.5,
        })
            .from('.text-head .scroll-down',{opacity: 0, duration: 4, ease: easing})
            .to('.text-head .rotate-on-scroll .inner',{rotate: '360deg', duration: 4, ease: easing}, "<")
            .from('.text-head .scroll-arrow',{rotationY:-90, duration: 3, ease: easing}, "<+.2");
    }

};