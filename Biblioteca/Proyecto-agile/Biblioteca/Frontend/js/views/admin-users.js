const AdminUsersView = {
    roles: [],

    render: async () => {
        return `
            <div class="dashboard-header">
                <h1 class="dashboard-title">Gestión de Usuarios</h1>
            </div>
            
            <div class="admin-filters">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="searchUser" class="form-control" placeholder="Buscar por email...">
                </div>
                <select id="filterRole" class="form-control" style="max-width: 200px;">
                    <option value="">Todos los roles</option>
                </select>
            </div>
            
            <div id="usersTable"></div>
            
            <!-- Role Modal -->
            <div id="roleModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center;">
                <div style="max-width: 400px; width: 90%; position: relative; z-index: 10000; background: var(--bg-secondary); padding: 0; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.4);">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid var(--border-color);">
                        <h3 id="roleModalTitle" style="margin: 0; font-size: 1.25rem; color: var(--text-primary);">Cambiar Rol</h3>
                        <button id="closeRoleModal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-muted); display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">&times;</button>
                    </div>
                    <form id="roleForm" style="padding: 24px;">
                        <div class="form-group" style="margin-bottom: 16px;">
                            <label class="form-label" style="display: block; margin-bottom: 8px; color: var(--text-secondary);">Usuario</label>
                            <input type="text" id="userEmail" class="form-control" readonly style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary);">
                            <input type="hidden" id="userId">
                        </div>
                        <div class="form-group" style="margin-bottom: 24px;">
                            <label class="form-label" style="display: block; margin-bottom: 8px; color: var(--text-secondary);">Rol *</label>
                            <select id="userRole" class="form-control" required style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary);"></select>
                        </div>
                        <div style="display: flex; gap: 12px; justify-content: flex-end;">
                            <button type="button" class="btn btn-ghost" id="cancelRoleBtn" style="padding: 8px 16px; border-radius: 6px; border: 1px solid var(--border-color); background: transparent; color: var(--text-primary); cursor: pointer;">Cancelar</button>
                            <button type="submit" class="btn btn-primary" style="padding: 8px 16px; border-radius: 6px; border: none; background: var(--primary); color: white; cursor: pointer;">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    afterRender: async () => {
        if (!document.getElementById('admin-users-styles')) {
            const styles = document.createElement('style');
            styles.id = 'admin-users-styles';
            styles.textContent = `
                .role-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
                .role-ADMIN { background: #dc2626; color: white; }
                .role-CUSTOMER { background: #6366f1; color: white; }
                .role-AUTHOR { background: #f59e0b; color: white; }
            `;
            document.head.appendChild(styles);
        }

        await AdminUsersView.loadRoles();
        await AdminUsersView.loadUsers();
        AdminUsersView.bindEvents();
    },

    loadRoles: async () => {
        try {
            AdminUsersView.roles = await HttpClient.get('/admin/users/roles');
            const filterSelect = document.getElementById('filterRole');
            const roleSelect = document.getElementById('userRole');

            AdminUsersView.roles.forEach(role => {
                filterSelect.innerHTML += `<option value="${role.id}">${role.name}</option>`;
                roleSelect.innerHTML += `<option value="${role.id}">${role.name}</option>`;
            });
        } catch (error) {
            console.error('Error loading roles:', error);
        }
    },

    loadUsers: async (emailFilter = '', roleFilter = '') => {
        const container = document.getElementById('usersTable');
        try {
            container.innerHTML = '<div class="text-center"><div class="spinner"></div></div>';

            let users = await HttpClient.get('/admin/users');

            if (emailFilter) {
                const filterLower = emailFilter.toLowerCase();
                users = users.filter(u => u.email?.toLowerCase().includes(filterLower));
            }
            if (roleFilter) {
                users = users.filter(u => u.roleId == roleFilter);
            }

            if (!users || users.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>No hay usuarios</p></div>';
                return;
            }

            container.innerHTML = Table.render({
                columns: [
                    { label: 'ID', key: 'id', width: '60px' },
                    { label: 'Email', key: 'email' },
                    {
                        label: 'Rol',
                        key: 'roleName',
                        formatter: (value) => `<span class="role-badge role-${value || 'NONE'}">${value || 'Sin rol'}</span>`
                    }
                ],
                data: users,
                actions: [
                    { name: 'editRole', icon: 'fas fa-user-shield', label: 'Cambiar Rol' },
                    { name: 'delete', icon: 'fas fa-trash', label: 'Eliminar', class: 'btn-danger' }
                ]
            });

            Table.bindEvents(container, {
                editRole: (id) => AdminUsersView.openRoleModal(id),
                delete: (id) => AdminUsersView.deleteUser(id)
            });

        } catch (error) {
            console.error('Error loading users:', error);
            container.innerHTML = '<div class="error-state"><p>Error al cargar usuarios</p></div>';
        }
    },

    bindEvents: () => {
        const modal = document.getElementById('roleModal');
        const form = document.getElementById('roleForm');
        const searchInput = document.getElementById('searchUser');
        const roleFilter = document.getElementById('filterRole');

        document.getElementById('closeRoleModal').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        document.getElementById('cancelRoleBtn').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await AdminUsersView.saveRole();
        });

        let searchTimeout;
        const applyFilters = () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                AdminUsersView.loadUsers(searchInput.value, roleFilter.value);
            }, 300);
        };

        searchInput.addEventListener('input', applyFilters);
        roleFilter.addEventListener('change', applyFilters);
    },

    openRoleModal: async (id) => {
        const modal = document.getElementById('roleModal');

        try {
            const user = await HttpClient.get(`/admin/users/${id}`);
            if (user) {
                document.getElementById('userId').value = user.id;
                document.getElementById('userEmail').value = user.email;
                document.getElementById('userRole').value = user.roleId || '';
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            Toast.show('Error al cargar usuario', 'error');
            return;
        }

        modal.style.display = 'flex';
    },

    saveRole: async () => {
        const id = document.getElementById('userId').value;
        const roleId = parseInt(document.getElementById('userRole').value);

        try {
            await HttpClient.put(`/admin/users/${id}/role`, { roleId });
            Toast.show('Rol actualizado', 'success');
            document.getElementById('roleModal').style.display = 'none';
            await AdminUsersView.loadUsers();
        } catch (error) {
            console.error('Error updating role:', error);
            Toast.show('Error al actualizar rol', 'error');
        }
    },

    deleteUser: async (id) => {
        if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) return;

        try {
            await HttpClient.delete(`/admin/users/${id}`);
            Toast.show('Usuario eliminado', 'success');
            await AdminUsersView.loadUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            const message = error.message || 'Error al eliminar usuario';
            Toast.show(message, 'error');
        }
    }
};
