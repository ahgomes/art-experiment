'use strict';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const dpr = window.devicePixelRatio;

class Object {
    constructor(d) {
        this._start = {
            x: d.x,
            y: d.y
        }

        this.x = d.x
        this.y = d.y
        this.width = d.width
        this.height = d.height
        this.image = d.image
    }

    draw() {
        if (!this.image) {
            c.fillStyle = '#fff'
            c.fillRect(this.x, this.y, this.width, this.height)
            return
        }

        //c.imageSmoothingEnabled = true;

        c.drawImage(
            this.image,
            this.x, this.y,
            this.width, this.height
        )
    }

    update() {
		this.draw()
	}
}

class Shape extends Object {
    constructor(d) {
        super(d)
        this.stress = d.stress
        this.alpha = d.alpha
    }

    update() {
        c.globalAlpha = this.alpha
        super.draw()
        c.globalAlpha = 1
    }
}

let _center, _middle;

function fix_dpi() {
    canvas.width = Math.floor(innerWidth * dpr)
    canvas.height = Math.floor(innerHeight * dpr)

    _center = canvas.width / 2
    _middle = canvas.height / 2
}

let setup = false;
let inplay = false;

let mouse = {
    x: -100,
    y: -100
}

canvas.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX * dpr;
    mouse.y = e.clientY * dpr;
    if (inplay) requestAnimationFrame(animate)
})

addEventListener('focus', function() {
    inplay = true
})

window.addEventListener('resize', function() {
    setup = false;
    fix_dpi()
    init()
    requestAnimationFrame(animate)
})



let cursor

let left_eye, right_eye
let eye_width
let blinked = false
let blink_count = 0

let bkgd_Objs

let dimentions = [
    '0.8 0 0.3 0.37 -0.03 0.7',
    '0.6 0 0.43 0.29 0.05 0.6',
    '0.01 0.7 0.28 0.33 0.07 1',
    '0.49 0.84 0.59 0.21 -0.06 1',
    '0.44 0.44 0.25 0.2 0.05 1',
    '0.12 0 0.27 0.25 0.01 0.7',
    '0 0 0.11 0.21 -0.06 1',
    '0 0 0.63 0.36 0.02 1',
    '0 0.23 0.33 0.16 -0.02 1',
    '0.28 0 0.16 0.08 0.02 1',
    '0.05 0 0.37 0.12 0.02 1',
    '0.17 0.25 0.05 0.04 -0.02 0.9',
    '0.29 0.1 0.13 0.26 0.02 0.9',
    '0.43 0.33 0.27 0.13 -0.03 0.6',
    '0.55 0.29 0.22 0.08 0.02 0.9',
    '0.69 0.35 0.05 0.09 -0.01 0.7',
    '0.18 0.63 0.59 0.2 0.05 1',
    '0.11 0.45 0.89 0.48 0.02 0.9',
    '0.19 1.06 0.27 0.15 0.03 1',
    '0.73 1.1 0.45 0.23 0.04 1',
    '0.71 1.06 0.42 0.19 -0.03 1',
    '0.72 0.93 0.51 0.41 0.02 0.9',
    '0.08 1.05 0.65 0.29 0.01 0.7',
    '0.11 0.93 0.47 0.18 0.03 1',
    '0.16 1.03 0.34 0.21 0.01 0.7',
    '0.33 1.23 0.06 0.11 0.02 0.9'
]

function obj_from_dim() {
    let comp_width = eye_width || canvas.width
    for (let i = 0; i < dimentions.length; i++) {
        let dim = dimentions[i].split(' ')
        bkgd_Objs.push(new Shape({
            x: Math.floor(canvas.width * parseFloat(dim[0])),
            y: Math.floor(comp_width * parseFloat(dim[1])),
            width: Math.floor(comp_width * parseFloat(dim[2])),
            height: Math.floor(comp_width * parseFloat(dim[3])),
            stress: parseFloat(dim[4]),
            alpha: parseFloat(dim[5]),
            image: img.bkgd[i]
        }))
    }
}

const img = {
    cursor: image('images/cursor.png'),
    left_eye: image('images/left_eye.png'),
    right_eye: image('images/right_eye.png'),
    blk_l: image('images/black_left_eye.png'),
    blk_r: image('images/black_right_eye.png'),
    bkgd: new Array(dimentions.length)
}

for (let i = 0; i < img.bkgd.length; i++) {
    let image_str = 'images/shape_' + (i < 9 ? '0' : '') + (i + 1) + '.png'
    img.bkgd[i] = image(image_str)
}


function image(src) {
    let img = new Image()
    img.src = src
    return img
}


function init() {
    if (!setup) {
        cursor = new Object({
            image: img.cursor,
            x: -200, y: -200,
            width: 150, height: 200
        })

        eye_width = Math.floor(canvas.width * 0.42);

        left_eye = new Object({
            x: Math.floor(eye_width * 0.45),
            y: Math.floor(_middle - eye_width * 0.28),
            width: eye_width,
            height: Math.floor(eye_width * 0.56),
            image: img.left_eye
        })

        right_eye = new Object({
            x: Math.floor(eye_width * 0.93),
            y: Math.floor(_middle - eye_width * 0.2),
            width: eye_width,
            height: Math.floor(eye_width * 0.56),
            image: img.right_eye
        })

        bkgd_Objs = []
        obj_from_dim()


        //setup = true
        inplay = true
        requestAnimationFrame(animate)
        return
    }

    cursor.x = mouse.x - cursor.width / 2
    cursor.y = mouse.y - cursor.height / 2


    left_eye.x = left_eye._start.x - Math.floor((mouse.x - _center) * 0.1)
    left_eye.y = left_eye._start.y + Math.floor((mouse.y - _middle) * 0.1)
    right_eye.x = right_eye._start.x - Math.floor((mouse.x - _center) * 0.2)
    right_eye.y = right_eye._start.y + Math.floor((mouse.y - _middle) * 0.1)


    for (let i = 0; i < bkgd_Objs.length; ++i) {
        let o = bkgd_Objs[i]
        o.x = o._start.x + Math.floor((mouse.x - _center) * o.stress)
        o.y = o._start.y + Math.floor((mouse.y - _middle) * o.stress)
    }
}

function animate() {
    if (setup && !document.hasFocus()) stop()
    if (setup && !inplay) return

    //requestAnimationFrame(animate)
    fix_dpi()

    for (let i = 0; i < bkgd_Objs.length; i++)
        bkgd_Objs[i].update()

    left_eye.update()
    right_eye.update()

    c.globalCompositeOperation = 'difference';
    cursor.update()


    if (!setup) setup = true
    else init()
}

function thing() {
    const b = c.createImageData(canvas.width, canvas.height);
    shape_from_points(binaryToPoints(imageToBinary(b)))
}

function center_line() {
    c.strokeStyle = '#fff'
    c.beginPath()
    c.moveTo(_center, 0)
    c.lineTo(_center, canvas.height)
    c.stroke()
}

function stop() {
    inplay = false;
    console.log("[ANIMATION STOPPED]")
}

fix_dpi()
init()
animate()
