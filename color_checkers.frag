#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846

uniform vec2 u_resolution;
uniform float u_time;

vec2 rotate2D(vec2 _st, float _angle){
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
      sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

vec2 tile(vec2 _st, float _zoom){
    _st *= _zoom;
    return fract(_st);
}

float box(vec2 _st, vec2 _size, float _smoothEdges){
    _size = vec2(0.5)-_size*0.5;
    vec2 aa = vec2(_smoothEdges*0.5);
    vec2 uv = smoothstep(_size,_size+aa,_st);
    uv *= smoothstep(_size,_size+aa,vec2(1.0)-_st);
    return uv.x*uv.y;
}

vec2 offset(vec2 _st, vec2 _offset){
    return fract(_st + vec2(0.5));
}

void main(void){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.y *= u_resolution.y/u_resolution.x;
    
    vec2 base_offset = vec2(0.2 * cos(u_time/6.0), 0.2 * sin(u_time/6.0));
    st = st + base_offset;
    
    float tile_height = 100.0;
    float tiles = u_resolution.y / tile_height;
    
    vec2 index = floor(st * tiles + 0.5) / tiles;
    st = tile(st, tiles);

    vec2 offsetSt = offset(st,vec2(0.5));

    st = rotate2D(st,PI*0.25);

    vec3 base_color = vec3(index.x, index.y, 0.0);
    float mixer = box(offsetSt,vec2(0.95),0.01);
    
    vec3 color = vec3(base_color * mixer)- box(st,vec2(0.3),0.01) + 2.*box(st,vec2(0.2),0.01);;

    gl_FragColor = vec4(color,1.0);
}

