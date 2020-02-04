#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define PI 3.14159265358979323846

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

float even(float a) {
	return (2.0 * ceil(0.9 * sin(PI * a))) - 1.0;
}

float odd(float a) {
    return (2.0 * ceil(0.9 * sin(PI * a + PI))) - 1.0;
}

void main(void){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    float grid = 6.0;
    float e = even(st.x * grid) * odd(st.y * grid);
    vec2 index = floor(st * grid);

    st = tile(st, grid);

    color = vec3(1.0);
    vec2 inner_space = rotate2D(st, u_time);
    
    float small_size_offset = 0.03 * e * cos(u_time * 6.0);
    
    vec3 inner_box = -1.0 * vec3(box(inner_space,vec2(0.2 + small_size_offset),0.01));
    inner_box = inner_box + 3.0 * vec3(box(inner_space,vec2(0.16 + small_size_offset),0.01));

    vec2 line_left_space = (st * vec2(0.2, 16.0)) + vec2(0.4, -7.5);
    vec3 line_left = -1.0 * vec3(box(line_left_space, vec2(0.5), 0.01));

    vec2 line_top_space = (st * vec2(16.0, 0.2)) + vec2(-7.5, 0.4);
    vec3 line_top = -1.0 * vec3(box(line_top_space, vec2(0.5), 0.01));

    color = color + inner_box + line_left + line_top;
    gl_FragColor = vec4(color,1.0);
}

