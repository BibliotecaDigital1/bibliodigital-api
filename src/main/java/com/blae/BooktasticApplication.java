package com.blae;

import org.modelmapper.ModelMapper; // <--- 1. Asegúrate de importar esto
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean; // <--- 2. Y esto

@SpringBootApplication
public class BooktasticApplication {

    public static void main(String[] args) {
        SpringApplication.run(BooktasticApplication.class, args);
    }

    // 3. AGREGA ESTE BLOQUE:
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}