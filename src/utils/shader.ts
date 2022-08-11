export const FragShader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec4 FaceNormal;
uniform vec4 ObserverPosition;
uniform vec4 LightPosition;
uniform vec4 ReferencePointPosition;

uniform vec3 Ka;
uniform vec3 Kd;
uniform vec3 Ks;
uniform float uN;

uniform vec3 Ila;
uniform vec3 Il;

uniform int uLightType;

varying vec3 normalInterpolation;
varying vec3 vertPos;
varying vec4 color;

vec4 getFlatColor(vec3 face){
  vec3 N  = normalize(face);
  vec3 L  = normalize(vec3(LightPosition - ReferencePointPosition));

  vec3 R = normalize(reflect(-L, N) );

  float ndotl = dot(N, L);
  float rdots = max(dot(R, L),0.0);
  if(ndotl < 0.0){
    ndotl = 0.0;
    rdots = 0.0;
  }

  float rDots = pow(rdots, uN);

  vec4 light = vec4((Ka * Ila + Il * (Kd * ndotl + Ks * rDots))/255.0, 1.0);
  return light;
}

vec4 getPhongColor(vec3 face){
  vec3 N  = normalize(face);
  vec3 L  = normalize(LightPosition.xyz - vertPos);
  vec3 V  = vec3(ObserverPosition) - vertPos;

  vec3 R = normalize(reflect(-L, N) );

  float ndotl = dot(N, L);
  float rdots = max(dot(R, L),0.0);
  if(ndotl < 0.0){
    ndotl = 0.0;
    rdots = 0.0;
  }

  float rDots = pow(rdots, uN);

  vec4 light = vec4((Ka * Ila + Il * (Kd * ndotl + Ks * rDots))/255.0, 1.0);
  return light;
}


void main(){
  if(uLightType == 0)
    gl_FragColor = getFlatColor(FaceNormal.xyz);
  else if(uLightType == 1)
    gl_FragColor = getPhongColor (normalInterpolation); 
  else if(uLightType == 2)
    gl_FragColor = color;
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
attribute vec3 aNormal;

varying vec3 normalInterpolation;
varying vec3 vertPos;
varying vec4 color;

uniform vec4 FaceNormal;
uniform vec4 ObserverPosition;
uniform vec4 LightPosition;
uniform vec4 ReferencePointPosition;

uniform vec3 Ka;
uniform vec3 Kd;
uniform vec3 Ks;
uniform float uN;

uniform vec3 Ila;
uniform vec3 Il;

vec4 getGouradColor(vec3 face){
  vec3 N  = normalize(face);
  vec3 L  = normalize(LightPosition.xyz - vertPos);
  vec3 V  = vec3(ObserverPosition) - vertPos;

  vec3 R = normalize(reflect(-L, N) );

  float ndotl = dot(N, L);
  float rdots = max(dot(R, L),0.0);
  if(ndotl < 0.0){
    ndotl = 0.0;
    rdots = 0.0;
  }

  float rDots = pow(rdots, uN);
  vec4 light = vec4((Ka * Ila + Il * (Kd * ndotl + Ks * rDots))/255.0, 1.0);
  return light;
}

void main(){
  vec4 viewModelPosition = uModelViewMatrix * vec4(aPosition, 1.0);
  normalInterpolation = aNormal;
  vertPos = aPosition;
  gl_Position = uProjectionMatrix * viewModelPosition;
  color = getGouradColor(normalInterpolation);
}
`;
