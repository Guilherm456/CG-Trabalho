export const FragShader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 uColor;


void main()
{
  gl_FragColor = vec4(uColor, 1.0);
}
`;

export const VertShader = `
#ifdef GL_ES
precision mediump float;
#endif

// Transformation matrices
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec2 uScreenSize;

attribute vec3 aPosition;
// P5 provides us with texture coordinates for most shapes
attribute vec2 aTexCoord;

// This is a varying variable, which in shader terms means that it will be passed from the vertex shader to the fragment shader
varying vec2 vTexCoord;

void main() {
  // Copy the texcoord attributes into the varying variable
  vTexCoord = aTexCoord;
  
  vec4 normalizedPosition = vec4(aPosition, 1.0);
    
  // doing .xy means we do the same math for both x and y positions
  //normalizedPosition.x = normalizedPosition.x - uScreenSize[0]/2.0;
  //normalizedPosition.y = normalizedPosition.y - uScreenSize[1]/2.0;

  vec4 viewModelPosition = uModelViewMatrix * normalizedPosition;
  gl_Position = uProjectionMatrix * viewModelPosition;
}
`;
