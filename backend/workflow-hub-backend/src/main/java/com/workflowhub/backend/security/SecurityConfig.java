package com.workflowhub.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf().disable()

            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()

            .authorizeHttpRequests(auth -> auth
            	    .requestMatchers("/api/auth/**").permitAll()

            	    .requestMatchers("/api/workflows/**")
            	        .hasAnyAuthority("EMPLOYEE", "ADMIN")

            	    .requestMatchers("/api/admin/**")
            	        .hasAuthority("ADMIN")

            	    .requestMatchers("/api/notifications/**")
            	        .hasAnyAuthority("EMPLOYEE", "ADMIN")

            	    .anyRequest().authenticated()
            	)



            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(
                    (req, res, ex2) -> res.sendError(401)
                )
            )

            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


}
