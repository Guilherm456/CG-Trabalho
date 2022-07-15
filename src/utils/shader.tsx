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
uniform mat4 vSRCMatrix;
uniform mat4 vProjectionMatrix;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

uniform vec2 uScreenSize;
uniform mat4 uViewMatrix;

attribute vec3 aPosition;

// This is a varying variable, which in shader terms means that it will be passed from the vertex shader to the fragment shader
varying vec2 vTexCoord;

void main() {

  
  vec4 normalizedPosition = vec4(aPosition, 1.0);
  // normalizedPosition = uViewMatrix * normalizedPosition;
    
  // doing .xy means we do the same math for both x and y positions
  // normalizedPosition.x = normalizedPosition.x - uScreenSize[0]/2.0;
  // normalizedPosition.y = normalizedPosition.y - uScreenSize[1]/2.0;

  // vec4 viewModelPosition = uModelViewMatrix * normalizedPosition;
  // gl_Position = uProjectionMatrix * viewModelPosition;
  gl_Position=  vSRCMatrix * vProjectionMatrix * uViewMatrix * normalizedPosition;
  gl_Position.xy /= gl_Position.w;
}
`;
