package com.mrt;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;
@Configuration public class WebConfig implements WebMvcConfigurer { public void addCorsMappings(CorsRegistry r){r.addMapping("/api/**").allowedOriginPatterns("http://localhost:*","https://*.github.io").allowedMethods("*").allowedHeaders("*");}}