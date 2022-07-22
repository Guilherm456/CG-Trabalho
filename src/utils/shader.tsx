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

vec4 getFlatColor(vec3 face){
  vec3 N  = normalize(face);
  vec3 L  = normalize(vec3(uLightPosition - uReferencePoint));
  vec3 V  = vec3(uObserver - uReferencePoint);

  vec3 R = normalize(reflect(-L, N) );
  vec3 S = normalize(V);

  float ndotl = max(dot(N, L), 0.0);
  float rdots = max(dot(R, L), 0.0);

  vec4 light = vec4((uKa + (uKd * ndotl) + (uKs * rdots*uN))/255.0, 1.0);
  return light;
}
vec4 getPhongColor(vec3 face){
  vec3 N  = normalize(face);
  vec3 s = normalize(vec3(uLightPosition - uReferencePoint));
  vec3 v = normalize(vec3(-uReferencePoint));
  vec3 r = reflect(-s, N);

  float d = max(dot(s,N), 0.0);

  vec3 ambient = uKa * uIla;
  vec3 diffuse = uKd * d;
  vec3 specular = vec3(0.0);
  if(d>0.0){
    specular = uKs * pow(max(dot(r,v), 0.0), uN);
  }
  
  vec3 light = (uIl*(ambient + diffuse + specular)/255.0);
  return vec4(light, 1.0);
}
void main(){
  
  gl_FragColor = getPhongColor (normalInterpolation); 
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

void main(){
  vec4 viewModelPosition = uModelViewMatrix * vec4(aPosition, 1.0);
  normalInterpolation = viewModelPosition.xyz;


  gl_Position = uProjectionMatrix * viewModelPosition;
}
`;
