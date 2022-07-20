export const FragShader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec4 uFaceNormal;
uniform vec4 uObserver;
uniform vec4 uLightPosition;
uniform vec4 uReferencePoint;

uniform vec3 uKa;
uniform vec3 uKd;
uniform vec3 uKs;
uniform float uN;

uniform vec3 uIla;
uniform vec3 uIl;

uniform bvec2 uLightType;

varying vec3 normalInterpolation;
void main()
{
  
  // vec3 N = normalize(normalInterpolation);
  vec3 N  = normalize(uFaceNormal.xyz);
  vec3 L  = normalize(vec3(uLightPosition - uReferencePoint));
  vec3 V  = vec3(uObserver - uReferencePoint);

  vec3 R = normalize( reflect(-L, N) );
  vec3 S = normalize(vec3(V));

  float ndotl = max(dot(N, L), 0.0);
  float rdots = max(dot(R, S), 0.0);

  gl_FragColor = vec4((uKa * uIla + uIl * (uKd * ndotl + uKs * pow(rdots,uN)))/255.0,1.0);



}
`;

export const VertShader = `
#ifdef GL_ES
precision mediump float;
#endif

// Transformation matrices
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec3 aPosition;

varying vec3 normalInterpolation;

// This is a varying variable, which in shader terms means that it will be passed from the vertex shader to the fragment shader
varying vec2 vTexvec3;

mat4 transpose(mat4 m) {
  return mat4(m[0][0], m[1][0], m[2][0], m[3][0],
              m[0][1], m[1][1], m[2][1], m[3][1],
              m[0][2], m[1][2], m[2][2], m[3][2],
              m[0][3], m[1][3], m[2][3], m[3][3]);
}

void main(){

  // vec4 concatenatedPosition = customConcatenated * vec4(aPosition, 1.0);
  // // concatenatedPosition.xy /= concatenatedPosition.w;

  // vec4 viewModelPosition = uModelViewMatrix * concatenatedPosition;
  // gl_Position = uProjectionMatrix * viewModelPosition;
  vec4 viewModelPosition = uModelViewMatrix * vec4(aPosition, 1.0);
  normalInterpolation = viewModelPosition.xyz;
  gl_Position = uProjectionMatrix * viewModelPosition;
}
`;
