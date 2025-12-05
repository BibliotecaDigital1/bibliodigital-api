package com.blae.api;

import com.blae.model.entity.Role;
import com.blae.model.entity.User;
import com.blae.repository.RoleRepository;
import com.blae.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    private final com.blae.repository.PurchaseRepository purchaseRepository;
    private final com.blae.repository.CollectionRepository collectionRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = users.stream()
            .map(user -> {
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", user.getId());
                userMap.put("email", user.getEmail());
                userMap.put("roleId", user.getRole() != null ? user.getRole().getId() : null);
                userMap.put("roleName", user.getRole() != null ? user.getRole().getName() : null);
                return userMap;
            })
            .toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getAllRoles() {
        return ResponseEntity.ok(roleRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Integer id) {
        return userRepository.findById(id)
            .map(user -> {
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", user.getId());
                userMap.put("email", user.getEmail());
                userMap.put("roleId", user.getRole() != null ? user.getRole().getId() : null);
                userMap.put("roleName", user.getRole() != null ? user.getRole().getName() : null);
                return ResponseEntity.ok(userMap);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Integer id, @RequestBody Map<String, Integer> body) {
        Integer roleId = body.get("roleId");
        if (roleId == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "roleId es requerido"));
        }

        return userRepository.findById(id)
            .map(user -> {
                Role role = roleRepository.findById(roleId)
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
                user.setRole(role);
                userRepository.save(user);
                return ResponseEntity.ok(Map.of("message", "Rol actualizado correctamente"));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        if (purchaseRepository.existsByUserId(id)) {
            return ResponseEntity.badRequest().body(Map.of("message", "No se puede eliminar el usuario porque tiene compras asociadas"));
        }

        if (collectionRepository.existsByCustomerId(id)) {
            return ResponseEntity.badRequest().body(Map.of("message", "No se puede eliminar el usuario porque tiene colecciones asociadas"));
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Usuario eliminado"));
    }
}
