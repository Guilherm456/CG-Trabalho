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
uniform mat4 vViewMatrix;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

uniform mat4 uViewMatrix;

attribute vec3 aPosition;

// This is a varying variable, which in shader terms means that it will be passed from the vertex shader to the fragment shader
varying vec2 vTexCoord;

mat4 transpose(mat4 m) {
  return mat4(m[0][0], m[1][0], m[2][0], m[3][0],
              m[0][1], m[1][1], m[2][1], m[3][1],
              m[0][2], m[1][2], m[2][2], m[3][2],
              m[0][3], m[1][3], m[2][3], m[3][3]);
}

void main() {
  
  vec4 normalizedPosition = vec4(aPosition, 1.0);

  gl_Position=  transpose(vSRCMatrix) * transpose(vProjectionMatrix) * transpose(vViewMatrix) * normalizedPosition;
  gl_Position.xy /= gl_Position.w;
}
`;
