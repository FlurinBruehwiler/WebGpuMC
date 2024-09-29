class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(other){
        return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    multiply(scalar){
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar)
    }
}

class Vector4 {
    constructor(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    perspectiveDivision(){
        return new Vector3(this.x / this.w, this.y / this.w, this.z / this.w);
    }
}

class Matrix4x4{
    constructor(m0, m4, m8, m12,
                m1, m5, m9, m13,
                m2, m6, m10, m14,
                m3, m7, m11, m15) {
        this.m0 = m0;
        this.m1 = m1;
        this.m2 = m2;
        this.m3 = m3;
        this.m4 = m4;
        this.m5 = m5;
        this.m6 = m6;
        this.m7 = m7;
        this.m8 = m8;
        this.m9 = m9;
        this.m10 = m10;
        this.m11 = m11;
        this.m12 = m12;
        this.m13 = m13;
        this.m14 = m14;
        this.m15 = m15;
    }

    static Identity(){
        return new Matrix4x4(1,0, 0, 0,
            0,  1, 0, 0,
            0,  0, 1, 0,
            0,  0, 0, 1)
    }

    static Translation(position){
        const matrix = this.Identity();
        matrix.setW(new Vector4(position.x, position.y, position.z, 1));
        return matrix;
    }

    static RotationX(radians){

        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        const matrix = this.Identity();
        matrix.setY(new Vector4(0, cos, sin, 0))
        matrix.setZ(new Vector4(0, -sin, cos, 0))

        return matrix;
    }

    static RotationY(radians){

        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        const matrix = this.Identity();
        matrix.setX(new Vector4(cos, 0, -sin, 0))
        matrix.setZ(new Vector4(sin, 0, cos, 0))

        return matrix;
    }

    static RotationZ(radians){

        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        const matrix = this.Identity();
        matrix.setX(new Vector4(cos, sin, 0, 0))
        matrix.setY(new Vector4(-sin, cos, 0, 0))

        return matrix;
    }

    multiply(other){
        return new Matrix4x4(
            DotProduct(this.row1(), other.column1()), DotProduct(this.row1(), other.column2()), DotProduct(this.row1(), other.column3()), DotProduct(this.row1(), other.column4()),
            DotProduct(this.row2(), other.column1()), DotProduct(this.row2(), other.column2()), DotProduct(this.row2(), other.column3()), DotProduct(this.row2(), other.column4()),
            DotProduct(this.row3(), other.column1()), DotProduct(this.row3(), other.column2()), DotProduct(this.row3(), other.column3()), DotProduct(this.row3(), other.column4()),
            DotProduct(this.row4(), other.column1()), DotProduct(this.row4(), other.column2()), DotProduct(this.row4(), other.column3()), DotProduct(this.row4(), other.column4())
        );
    }

    //http://matrixmultiplication.xyz/
    multiplyVector(v){
        return new Vector4(DotProduct(this.row1(), v), DotProduct(this.row2(), v), DotProduct(this.row3(), v), DotProduct(this.row4(), v));
    }

    row1(){
        return new Vector4(this.m0, this.m4, this.m8, this.m12)
    }

    row2(){
        return new Vector4(this.m1, this.m5, this.m9, this.m13)
    }

    row3(){
        return new Vector4(this.m2, this.m6, this.m10, this.m14)
    }

    row4(){
        return new Vector4(this.m3, this.m7, this.m11, this.m15)
    }

    column1(){
        return new Vector4(this.m0, this.m1, this.m2, this.m3)
    }

    column2(){
        return new Vector4(this.m4, this.m5, this.m6, this.m7)
    }

    column3(){
        return new Vector4(this.m8, this.m9, this.m10, this.m11)
    }

    column4(){
        return new Vector4(this.m12, this.m13, this.m14, this.m15)
    }

    setX(v){
        this.m0 = v.x;
        this.m1 = v.y;
        this.m2 = v.z;
        this.m3 = v.w;
    }

    setY(v){
        this.m4 = v.x;
        this.m5 = v.y;
        this.m6 = v.z;
        this.m7 = v.w;
    }

    setZ(v){
        this.m8 = v.x;
        this.m9 = v.y;
        this.m10 = v.z;
        this.m11 = v.w;
    }

    setW(v){
        this.m12 = v.x;
        this.m13 = v.y;
        this.m14 = v.z;
        this.m15 = v.w;
    }

    toArray(){
        return [
            this.m0, this.m1, this.m2, this.m3,
            this.m4, this.m5, this.m6, this.m7,
            this.m8, this.m9, this.m10, this.m11,
            this.m12, this.m13, this.m14, this.m15,
        ]
    }

    invert(){
        const a = this.column1().x, b = this.column1().y, c = this.column1().z, d = this.column1().w;
        const e = this.column2().x, f = this.column2().y, g = this.column2().z, h = this.column2().w;
        const i = this.column3().x, j = this.column3().y, k = this.column3().z, l = this.column3().w;
        const m = this.column4().x, n = this.column4().y, o = this.column4().z, p = this.column4().w;

        const kp_lo = k * p - l * o;
        const jp_ln = j * p - l * n;
        const jo_kn = j * o - k * n;
        const ip_lm = i * p - l * m;
        const io_km = i * o - k * m;
        const in_jm = i * n - j * m;

        const a11 = +(f * kp_lo - g * jp_ln + h * jo_kn);
        const a12 = -(e * kp_lo - g * ip_lm + h * io_km);
        const a13 = +(e * jp_ln - f * ip_lm + h * in_jm);
        const a14 = -(e * jo_kn - f * io_km + g * in_jm);

        const det = a * a11 + b * a12 + c * a13 + d * a14;

        // if (float.Abs(det) < float.Epsilon)
        // {
        //     throw Error("inverse error")
        // }

        const invDet = 1.0 / det;

        const result = new Matrix4x4()

        result.m0 = a11 * invDet;
        result.m4 = a12 * invDet;
        result.m8 = a13 * invDet;
        result.m12 = a14 * invDet;

        result.m1 = -(b * kp_lo - c * jp_ln + d * jo_kn) * invDet;
        result.m5 = +(a * kp_lo - c * ip_lm + d * io_km) * invDet;
        result.m9 = -(a * jp_ln - b * ip_lm + d * in_jm) * invDet;
        result.m13 = +(a * jo_kn - b * io_km + c * in_jm) * invDet;

        const gp_ho = g * p - h * o;
        const fp_hn = f * p - h * n;
        const fo_gn = f * o - g * n;
        const ep_hm = e * p - h * m;
        const eo_gm = e * o - g * m;
        const en_fm = e * n - f * m;

        result.m2 = +(b * gp_ho - c * fp_hn + d * fo_gn) * invDet;
        result.m6 = -(a * gp_ho - c * ep_hm + d * eo_gm) * invDet;
        result.m10 = +(a * fp_hn - b * ep_hm + d * en_fm) * invDet;
        result.m14 = -(a * fo_gn - b * eo_gm + c * en_fm) * invDet;

        const gl_hk = g * l - h * k;
        const fl_hj = f * l - h * j;
        const fk_gj = f * k - g * j;
        const el_hi = e * l - h * i;
        const ek_gi = e * k - g * i;
        const ej_fi = e * j - f * i;

        result.m3 = -(b * gl_hk - c * fl_hj + d * fk_gj) * invDet;
        result.m7 = +(a * gl_hk - c * el_hi + d * ek_gi) * invDet;
        result.m11 = -(a * fl_hj - b * el_hi + d * ej_fi) * invDet;
        result.m15 = +(a * fk_gj - b * ek_gi + c * ej_fi) * invDet;

        return result;
    }
}

const gameInfo = {
    vertices : [],
    renderPipeline: undefined,
    device: undefined,
    context: undefined,
    screenDimensions: {width: 0, height: 0},
    canvas: undefined,
}

await Init();

async function Init() {
    const canvas = document.querySelector("#gpuCanvas")

    canvas.addEventListener("click", function () {
        canvas.requestPointerLock();
    });

    await InitRenderer(canvas)

    let frameCount = 0;
    let camera = {
        position: new Vector3(10, 0, 0),
        rotation: new Vector3(0, Math.PI / 2, 0)
    }

    let wDown = false;
    let aDown = false;
    let sDown = false;
    let dDown = false;
    let spaceDown = false;
    let shiftDown = false;
    let leftDown = false;
    let rightDown = false;
    let mouseChangeX = 0;
    let mouseChangeY = 0;

    document.onkeydown = (event) => {
        HandleKeyEvent(event.code, true)
    }

    document.onkeyup = (event) => {
        HandleKeyEvent(event.code, false)
    }

    canvas.addEventListener("mousemove", (event) => {
        mouseChangeX += event.movementX;
        mouseChangeY += event.movementY;
    })

    requestAnimationFrame(Frame)

    function Frame(){
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;

        frameCount++;

        const velocity = 0.5;

        if(wDown){
            const transformation = Matrix4x4.RotationY(camera.rotation.y).multiplyVector(new Vector4(0, 0, 1, 0))
            camera.position = camera.position.add(new Vector3(transformation.x, transformation.y, transformation.z).multiply(-velocity));
        }
        if(sDown){
            const transformation = Matrix4x4.RotationY(camera.rotation.y).multiplyVector(new Vector4(0, 0, 1, 0))
            camera.position = camera.position.add(new Vector3(transformation.x, transformation.y, transformation.z).multiply(velocity));
        }

        camera.rotation.y += -mouseChangeX * 0.001;
        // camera.rotation.x += -mouseChangeY * 0.001;
        // camera.rotation.z += -mouseChangeY * 0.001;

        if(aDown){
            const transformation = Matrix4x4.RotationY(camera.rotation.y).multiplyVector(new Vector4(1, 0, 0, 0))
            camera.position = camera.position.add(new Vector3(transformation.x, transformation.y, transformation.z).multiply(-velocity));
        }
        if(dDown){
            const transformation = Matrix4x4.RotationY(camera.rotation.y).multiplyVector(new Vector4(1, 0, 0, 0))
            camera.position = camera.position.add(new Vector3(transformation.x, transformation.y, transformation.z).multiply(velocity));
        }

        if(shiftDown){
            camera.position.y -= velocity;
        }
        if(spaceDown){
            camera.position.y += velocity;
        }

        StartFrame();

        DrawCube()

        EndFrame(camera);

        mouseChangeY = 0;
        mouseChangeX = 0;

        requestAnimationFrame(Frame);
    }

    function HandleKeyEvent(keyCode, isDown) {
        if(keyCode === "KeyW"){
            wDown = isDown;
        }
        if(keyCode === "KeyA"){
            aDown = isDown;
        }
        if(keyCode === "KeyS"){
            sDown = isDown;
        }
        if(keyCode === "KeyD"){
            dDown = isDown;
        }
        if(keyCode === "Space"){
            spaceDown = isDown;
        }
        if(keyCode === "ShiftLeft"){
            shiftDown = isDown;
        }
        if(keyCode === "ArrowLeft"){
            leftDown = isDown;
        }
        if(keyCode === "ArrowRight"){
            rightDown = isDown;
        }
    }
}

//model: position, rotation, scale of an object
//view: inverse of the cameras own model matrix
//projection: to clip space

function StartFrame() {
    gameInfo.vertices = [];
}

async function InitRenderer(canvas) {
    const adapter = await navigator.gpu.requestAdapter();
    gameInfo.device = await adapter.requestDevice();
    gameInfo.screenDimensions.width = canvas.width;
    gameInfo.screenDimensions.height = canvas.height;
    gameInfo.canvas = canvas;

    const shaderDownloadResponse = await fetch("shader.wgsl");
    const shaders = await shaderDownloadResponse.text();

    const shaderModule = gameInfo.device.createShaderModule({
        code: shaders
    })

    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

    console.log(presentationFormat)

    gameInfo.context = canvas.getContext("webgpu")
    gameInfo.context.configure({
        device: gameInfo.device,
        format: presentationFormat,
        alphaMode: "premultiplied",
    })

    const vertexBuffers = [
        {
            attributes: [
                {
                    shaderLocation: 0, //position
                    offset: 0,
                    format: "float32x4"
                },
                {
                    shaderLocation: 1, //color
                    offset: 16,
                    format: "float32x4"
                }
            ],
            arrayStride: 32,
            stepMode: "vertex"
        }
    ]

    const pipelineDescriptor = {
        vertex: {
            module: shaderModule,
            entryPoint: "vertex_main",
            buffers: vertexBuffers
        },
        fragment: {
            module: shaderModule,
            entryPoint: "fragment_main",
            targets: [
                {
                    format: presentationFormat
                }
            ]
        },
        primitive: {
            topology: "triangle-list"
        },
        layout: "auto"
    }

    gameInfo.renderPipeline = gameInfo.device.createRenderPipeline(pipelineDescriptor);
}

function DrawRectangle(v1, v2, v3, v4) {
    DrawTriangle(v1, v2, v3);
    DrawTriangle(v1, v3, v4);
}

function DrawCube(position) {
    const bottomBackLeft = new Vector3(0, 0, 0)
    const bottomBackRight = new Vector3(1, 0, 0)
    const bottomFrontLeft = new Vector3(0, 0, 1)
    const bottomFrontRight = new Vector3(1, 0, 1)

    const topBackLeft = new Vector3(0, 1, 0)
    const topBackRight = new Vector3(1, 1, 0)
    const topFrontLeft = new Vector3(0, 1, 1)
    const topFrontRight = new Vector3(1, 1, 1)

    DrawRectangle(
        bottomBackLeft,
        bottomBackRight,
        bottomFrontRight,
        bottomFrontLeft,
    );
    DrawRectangle(
        bottomBackLeft,
        bottomBackRight,
        topBackRight,
        topBackLeft,
    );
    DrawRectangle(
        topFrontLeft,
        topFrontRight,
        topBackRight,
        topBackLeft,
    );
    DrawRectangle(
        topFrontLeft,
        topFrontRight,
        bottomFrontRight,
        bottomFrontLeft,
    );
    DrawRectangle(
        topBackRight,
        topFrontRight,
        bottomFrontRight,
        bottomBackRight,
    );
    DrawRectangle(
        topBackLeft,
        topFrontLeft,
        bottomFrontLeft,
        bottomBackLeft,
    );
}

function DrawTriangle(v1, v2, v3) {
    gameInfo.vertices.push(v1, v2, v3)
}

function EndFrame(camera) {

    gameInfo.screenDimensions.width = gameInfo.canvas.width;
    gameInfo.screenDimensions.height = gameInfo.canvas.height;

    const commandEncoder = gameInfo.device.createCommandEncoder();
    const clearColor = { r: 0.0, g: 0.5, b: 1.0, a: 1.0 };

    const renderPassDescriptor = {
        colorAttachments: [
            {
                clearValue: clearColor,
                loadOp: "clear",
                storeOp: "store",
                view: gameInfo.context.getCurrentTexture().createView()
            }
        ]
    }

    //vertices
    const vertices = new Float32Array(gameInfo.vertices.flatMap(v =>
                                                    [
                                                        v.x, v.y, v.z, 1,
                                                        1, 0.6, 1, 1
                                                    ]))

    const vertexBuffer = gameInfo.device.createBuffer({
        size: vertices.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });

    gameInfo.device.queue.writeBuffer(vertexBuffer, 0, vertices, 0, vertices.length);

    const projectionMatrix = CreateCameraProjectionMatrix(60 * (Math.PI / 180), gameInfo.screenDimensions.width / gameInfo.screenDimensions.height, 0.00001, 1000);
    let rotation = Matrix4x4.RotationZ(camera.rotation.z).multiply(Matrix4x4.RotationY(camera.rotation.y)).multiply(Matrix4x4.RotationX(camera.rotation.x))

    let cameraModelMatrix = Matrix4x4.Translation(camera.position).multiply(rotation);
    let viewMatrix = cameraModelMatrix.invert()

    //https://jsantell.com/model-view-projection/
    //https://jsantell.com/3d-projection/

    const viewMatrixData = new Float32Array(viewMatrix.toArray());
    const projectionMatrixData = new Float32Array(projectionMatrix.toArray());

    const viewMatrixBuffer = gameInfo.device.createBuffer({
        size: 16*4, //4x4 matrix
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const projectionMatrixBufferBuffer = gameInfo.device.createBuffer({
        size: 16*4, //4x4 matrix
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    gameInfo.device.queue.writeBuffer(viewMatrixBuffer, 0, viewMatrixData, 0, viewMatrixData.length);
    gameInfo.device.queue.writeBuffer(projectionMatrixBufferBuffer, 0, projectionMatrixData, 0, projectionMatrixData.length);

    const bindGroup = gameInfo.device.createBindGroup({
        layout: gameInfo.renderPipeline.getBindGroupLayout(0),
        entries: [
            { binding: 0, resource: { buffer: viewMatrixBuffer } }, //these buffers could be combined into a single buffer. Then we could specify an offset and size https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createBindGroup#gpubufferbinding_objects
            { binding: 1, resource: { buffer: projectionMatrixBufferBuffer } },
        ]
    })

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

    passEncoder.setPipeline(gameInfo.renderPipeline);
    passEncoder.setVertexBuffer(0, vertexBuffer)
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.draw(gameInfo.vertices.length) //vertex count

    passEncoder.end();
    const commandBuffer = commandEncoder.finish();
    gameInfo.device.queue.submit([commandBuffer]);

    vertexBuffer.destroy(); //do I need this?
}

function CreateCameraProjectionMatrix(fov, aspectRatio, nearDistance, farDistance) {
    const height = 1 / Math.tan(fov * 0.5);
    const width = height / aspectRatio;
    const range = farDistance / (nearDistance - farDistance);

    const matrix = new Matrix4x4();
    matrix.setX(new Vector4(width, 0, 0, 0));
    matrix.setY(new Vector4(0, height, 0, 0));
    matrix.setZ(new Vector4(0, 0, range, -1));
    matrix.setW(new Vector4(0, 0, range * nearDistance, 0));
    return matrix;
}

function DotProduct(v1, v2) {
    return v1.x * v2.x
        + v1.y * v2.y
        + v1.z * v2.z
        + v1.w * v2.w;
}
