export default class Physics
{
    constructor(vLimit,aLimit,omega,angle,xRotCenter,yRotCenter,jumpForce = 0)
    {
        this.vx = 0;                        // Current velocity on the X-axis (px/s)
        this.vy = 0;                        // Current velocity on the Y-axis (px/s)
        this.vLimit = vLimit;               // Maximum velocity the sprite can reach
        this.ax = 0;                        // Acceleration on the X-axis
        this.ay = 0;                        // Acceleration on the Y-axis
        this.aLimit = aLimit;               // Acceleration limit (Default is 0, meaning no acceleration)
        this.omega = omega;                 // Angular velocity in rad/s
        this.angle = angle;                 // Current angle in radians
        this.xRotCenter = xRotCenter;       // X-coordinate of the sprite's rotation center (for circular motion)
        this.yRotCenter = yRotCenter;       // Y-coordinate of the sprite's rotation center (for circular motion)
        this.jumpForce = jumpForce;

    }
}