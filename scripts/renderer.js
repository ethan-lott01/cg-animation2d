import * as CG from './transforms.js';
import { Matrix } from "./matrix.js";

class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // limit_fps_flag:      bool 
    // fps:                 int
    constructor(canvas, limit_fps_flag, fps) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.limit_fps = limit_fps_flag;
        this.fps = fps;
        this.start_time = null;
        this.prev_time = null;

        this.models = {
            slide0: [
                // example model (diamond) -> should be replaced with actual model
                {
                    vertices: [
                        CG.Vector3(400, 150, 1),
                        CG.Vector3(500, 300, 1),
                        CG.Vector3(400, 450, 1),
                        CG.Vector3(300, 300, 1)
                    ],
                    transform: null
                }
            ],
            slide1: [
                {
                    vertices: [
                        CG.Vector3(-50, 50, 1),
                        CG.Vector3(50, 50, 1),
                        CG.Vector3(50, -50, 1),
                        CG.Vector3(-50, -50, 1)
                    ],
                    transform: null
                },
                {
                    vertices: [
                        CG.Vector3(-50, 50, 1),
                        CG.Vector3(50, 50, 1),
                        CG.Vector3(50, -50, 1),
                        CG.Vector3(-50, -50, 1)
                    ],
                    transform: null
                },
                {
                    vertices: [
                        CG.Vector3(-50, 50, 1),
                        CG.Vector3(50, 50, 1),
                        CG.Vector3(50, -50, 1),
                        CG.Vector3(-50, -50, 1)
                    ],
                    transform: null
                }
            ],
            slide2: [
                {
                    vertices: [
                        CG.Vector3(-50, 50, 1),
                        CG.Vector3(50, 50, 1),
                        CG.Vector3(50, -50, 1),
                        CG.Vector3(-50, -50, 1)
                    ],
                    transform: null
                }
            ],
            slide3: []
        };
    }

    // flag:  bool
    limitFps(flag) {
        this.limit_fps = flag;
    }

    // n:  int
    setFps(n) {
        this.fps = n;
    }

    // idx: int
    setSlideIndex(idx) {
        this.slide_idx = idx;
    }

    animate(timestamp) {
        // Get time and delta time for animation
        if (this.start_time === null) {
            this.start_time = timestamp;
            this.prev_time = timestamp;
        }
        let time = timestamp - this.start_time;
        let delta_time = timestamp - this.prev_time;
        //console.log('animate(): t = ' + time.toFixed(1) + ', dt = ' + delta_time.toFixed(1));

        // Update transforms for animation
        this.updateTransforms(time, delta_time);

        // Draw slide
        this.drawSlide();

        // Invoke call for next frame in animation
        if (this.limit_fps) {
            setTimeout(() => {
                window.requestAnimationFrame((ts) => {
                    this.animate(ts);
                });
            }, Math.floor(1000.0 / this.fps));
        }
        else {
            window.requestAnimationFrame((ts) => {
                this.animate(ts);
            });
        }

        // Update previous time to current one for next calculation of delta time
        this.prev_time = timestamp;
    }

    //
    updateTransforms(time, delta_time) {
        // TODO: update any transformations needed for animation
        let vX = 50;
        let vY = 10;
        
        let xDisplacement = vX * time/1000;
        let yDisplacement = vY * time/1000;

        if (xDisplacement > this.canvas.width) {
            xDisplacement = -1*xDisplacement;
        }

        this.models.slide0[0].transform = CG.mat3x3Translate(new Matrix(3, 3), xDisplacement, yDisplacement);

        // Slide 1
        let omega = Math.PI / 4;
        let theta = omega * time / 1000;
        let xDisplacement1 = 200;
        let yDisplacement1 = 200;
        
        let omega2 = Math.PI / 1;
        let theta2 = -omega2 * time / 1000;
        let xDisplacement2 = 500;
        let yDisplacement2 = 200;

        let omega3 = Math.PI / 3;
        let theta3 = omega3 * time / 1000;
        let xDisplacement3 = 600;
        let yDisplacement3 = 400;
        
        let centerX = (this.models.slide1[0].vertices[0].values[0][0] + this.models.slide1[0].vertices[1].values[0][0]) / 2;
        let centerY = (this.models.slide1[0].vertices[0].values[1][0] + this.models.slide1[0].vertices[2].values[1][0]) / 2;
        
        let translationMatrix = CG.mat3x3Translate(new Matrix(3, 3), xDisplacement1, yDisplacement1);
        let translationMatrix2 = CG.mat3x3Translate(new Matrix(3, 3), xDisplacement2, yDisplacement2);
        let translationMatrix3 = CG.mat3x3Translate(new Matrix(3, 3), xDisplacement3, yDisplacement3);

        let rotationMatrix = CG.mat3x3Translate(new Matrix(3, 3), -centerX, -centerY);
        rotationMatrix = Matrix.multiply([rotationMatrix, CG.mat3x3Rotate(new Matrix(3, 3), theta), CG.mat3x3Translate(new Matrix(3, 3), centerX, centerY)]);
        let rotationMatrix2 = CG.mat3x3Translate(new Matrix(3, 3), -centerX, -centerY);
        rotationMatrix2 = Matrix.multiply([rotationMatrix, CG.mat3x3Rotate(new Matrix(3, 3), theta2), CG.mat3x3Translate(new Matrix(3, 3), centerX, centerY)]);
        let rotationMatrix3 = CG.mat3x3Translate(new Matrix(3, 3), -centerX, -centerY);
        rotationMatrix3 = Matrix.multiply([rotationMatrix, CG.mat3x3Rotate(new Matrix(3, 3), theta3), CG.mat3x3Translate(new Matrix(3, 3), centerX, centerY)]);

        this.models.slide1[0].transform = Matrix.multiply([translationMatrix, rotationMatrix]);
        this.models.slide1[1].transform = Matrix.multiply([translationMatrix2, rotationMatrix2]);
        this.models.slide1[2].transform = Matrix.multiply([translationMatrix3, rotationMatrix3]);

        // Slide 2
        let maxSize = 30;
        let minSize = 10;
        let scaleFactor = Math.sin(time / 1000);
        let size = (maxSize - minSize) / 10 * scaleFactor;

        let slide2_xDisplacement = 200;
        let slide2_yDisplacement = 200;

        let slide2_translate = CG.mat3x3Translate(new Matrix(3, 3), slide2_xDisplacement, slide2_yDisplacement);
        let slide2_scale = CG.mat3x3Translate(new Matrix(3, 3), -centerX, -centerY);
        slide2_scale = Matrix.multiply([slide2_scale, CG.mat3x3Scale(new Matrix(3, 3), size, size), CG.mat3x3Translate(new Matrix(3, 3), centerX, centerY)]);

        this.models.slide2[0].transform = Matrix.multiply([slide2_translate, slide2_scale]);
    }
    
    //
    drawSlide() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0();
                break;
            case 1:
                this.drawSlide1();
                break;
            case 2:
                this.drawSlide2();
                break;
            case 3:
                this.drawSlide3();
                break;
        }
    }

    //
    drawSlide0() {
        // TODO: draw bouncing ball (circle that changes direction whenever it hits an edge)
        
        
        // Following lines are example of drawing a single polygon
        // (this should be removed/edited after you implement the slide)
        let teal = [0, 128, 128, 255];
        let vertices = [];
        for (let i=0; i < this.models.slide0[0].vertices.length; i++) {
            let vertex = Matrix.multiply([this.models.slide0[0].transform, this.models.slide0[0].vertices[i]]);
            vertices.push(vertex);
        }
        this.drawConvexPolygon(vertices, teal);
    }

    //
    drawSlide1() {
        // TODO: draw at least 3 polygons that spin about their own centers
        //   - have each polygon spin at a different speed / direction

        let teal = [0, 128, 128, 255];
        let vertices = [];
        for (let i=0; i < this.models.slide1[0].vertices.length; i++) {
            let vertex = Matrix.multiply([this.models.slide1[0].transform, this.models.slide1[0].vertices[i]]);
            vertices.push(vertex);
        }
        this.drawConvexPolygon(vertices, teal);

        let red = [255, 0, 0, 255];
        let vertices2 = [];
        for (let i=0; i < this.models.slide1[1].vertices.length; i++) {
            let vertex = Matrix.multiply([this.models.slide1[1].transform, this.models.slide1[1].vertices[i]]);
            vertices2.push(vertex);
        }
        this.drawConvexPolygon(vertices2, red);

        let blue = [0, 0, 255, 255];
        let vertices3 = [];
        for (let i=0; i < this.models.slide1[2].vertices.length; i++) {
            let vertex = Matrix.multiply([this.models.slide1[2].transform, this.models.slide1[2].vertices[i]]);
            vertices3.push(vertex);
        }
        this.drawConvexPolygon(vertices3, blue);
        
    }

    //
    drawSlide2() {
        // TODO: draw at least 2 polygons grow and shrink about their own centers
        //   - have each polygon grow / shrink different sizes
        //   - try at least 1 polygon that grows / shrinks non-uniformly in the x and y directions

        let teal = [0, 128, 128, 255];
        let vertices = [];
        for (let i=0; i < this.models.slide2[0].vertices.length; i++) {
            let vertex = Matrix.multiply([this.models.slide2[0].transform, this.models.slide2[0].vertices[i]]);
            vertices.push(vertex);
        }
        this.drawConvexPolygon(vertices, teal);


    }

    //
    drawSlide3() {
        // TODO: get creative!
        //   - animation should involve all three basic transformation types
        //     (translation, scaling, and rotation)
        
        
    }
    
    // vertex_list:  array of object [Matrix(3, 1), Matrix(3, 1), ..., Matrix(3, 1)]
    // color:        array of int [R, G, B, A]
    drawConvexPolygon(vertex_list, color) {
        this.ctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3] / 255) + ')';
        this.ctx.beginPath();
        let x = vertex_list[0].values[0][0] / vertex_list[0].values[2][0];
        let y = vertex_list[0].values[1][0] / vertex_list[0].values[2][0];
        this.ctx.moveTo(x, y);
        for (let i = 1; i < vertex_list.length; i++) {
            x = vertex_list[i].values[0][0] / vertex_list[i].values[2][0];
            y = vertex_list[i].values[1][0] / vertex_list[i].values[2][0];
            this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
};

export { Renderer };
