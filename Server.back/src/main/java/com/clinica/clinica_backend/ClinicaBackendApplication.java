package com.clinica.clinica_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@EnableConfigurationProperties

@SpringBootApplication
public class ClinicaBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClinicaBackendApplication.class, args);
	}

}
