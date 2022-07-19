export const FragShader = `
#ifdef GL_ES
precision mediump float;
#endif

// uniform vec3 uColor;


// void main()
// {
//   gl_FragColor = vec4(uColor, 1.0);
// }
uniform vec4 uFaceNormal;
uniform vec4 uObserver;
uniform vec4 uLightPosition;
uniform vec4 uReferencePoint;

// ratios
uniform vec3 uKa;
uniform vec3 uKd;
uniform vec3 uKs;
uniform float uN;
uniform vec3 uIla;
uniform vec3 uIl;

void main()
{
  vec4 N = uFaceNormal;
  vec4 L = uLightPosition - uReferencePoint;
  
  float Fatt = min(
    1.0/distance(
      vec3(uReferencePoint), vec3(uLightPosition)
    ),
    1.0
  );
  
  float itR = 
  (uKa[0] * uIla[0] + Fatt * uIl[0] * (uKd[0] * dot(vec3(N), vec3(L))))/255.0;
  
  float itG = 
  (uKa[1] * uIla[1] + Fatt * uIl[1] * (uKd[1] * dot(vec3(N), vec3(L) )))/255.0;
  
  float itB = 
  (uKa[2] * uIla[2] + Fatt * uIl[2] * (uKd[2] * dot(vec3(N), vec3(L) )))/255.0;
  
  gl_FragColor = vec4(itR, itG, itB, 1.0);
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

// void main() {
  
//   vec4 normalizedPosition = vec4(aPosition, 1.0);

//   mat4 concatenatedMatrix = transpose(vViewMatrix) * transpose(vProjectionMatrix) * transpose(vSRCMatrix);

//   gl_Position=  normalizedPosition * concatenatedMatrix;

//   gl_Position.xy /= gl_Position.w;
// }
void main(){
mat4 customConcatenated = transpose(vViewMatrix) * transpose(vProjectionMatrix) * transpose(vSRCMatrix);

  vec4 concatenatedPosition = customConcatenated * vec4(aPosition, 1.0);
  concatenatedPosition.xy /= concatenatedPosition.w;

  vec4 viewModelPosition = uModelViewMatrix * concatenatedPosition;
  gl_Position = uProjectionMatrix * viewModelPosition;
}
`;
