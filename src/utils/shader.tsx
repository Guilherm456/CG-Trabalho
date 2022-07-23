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

uniform int uLightType;

varying vec3 normalInterpolation;
varying vec3 vertPos;

vec4 getFlatColor(vec3 face){
  vec3 N  = normalize(face);
  vec3 L  = normalize(vec3(uLightPosition - uReferencePoint));
  vec3 V  = vec3(uObserver - uReferencePoint);

  vec3 R = normalize(reflect(-L, N) );
  vec3 S = normalize(V);

  float ndotl = dot(N, L);
  float rdots = 0.0;
  if(ndotl >0.0)
  {
    rdots = max(dot(R, L), 0.0);
  }
  else ndotl = 0.0;

  vec4 light = vec4((uKa * uIla + uIl * (uKd * ndotl + uKs * pow(rdots,uN)))/255.0, 1.0);
  return light;
}

vec4 getPhongColor(vec3 face){
  vec3 N  = normalize(face);
  vec3 L  = normalize(uLightPosition.xyz - vertPos);
  vec3 V  = -vertPos;

  vec3 R = normalize(reflect(-L, N) );
  vec3 S = normalize(V);

  float ndotl = dot(N, L);
  float rdots = 0.0;
  if(ndotl >0.0)
  {
    rdots = max(dot(R, L), 0.0);
  }
  else ndotl = 0.0;

  vec4 light = vec4((uKa * uIla + uIl * (uKd * ndotl + uKs * pow(rdots,uN)))/255.0, 1.0);
  return light;
}


void main(){
  if(uLightType == 0)
    gl_FragColor = getFlatColor(uFaceNormal.xyz);
  else if(uLightType == 1)
    gl_FragColor = getPhongColor (-normalInterpolation); 
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
varying vec3 vertPos;

void main(){
  vec4 viewModelPosition = uModelViewMatrix * vec4(aPosition, 1.0);
  normalInterpolation = viewModelPosition.xyz;
  vertPos = viewModelPosition.xyz/viewModelPosition.w;
  gl_Position = uProjectionMatrix * viewModelPosition;
}
`;
