package com.examly.springapp.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // URL patterns to apply CORS configuration
            .allowedOriginPatterns("*") // Allow all origins via patterns
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allowed HTTP methods
            .allowedHeaders("*") // Allow all headers
            .allowCredentials(true); // Allow credentials (cookies, authentication)
    }
}
