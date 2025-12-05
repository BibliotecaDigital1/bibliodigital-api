const ProfileView = {
  render: async () => {
    const user = Storage.getAuth().user;
    return `
      <div class="dashboard-header">
        <h1 class="dashboard-title">Mi Perfil</h1>
      </div>
      <div class="profile-container">
        <div class="profile-card">
          <div class="profile-avatar">
            <div class="avatar avatar-lg">${user.firstName ? user.firstName[0] : ''}${user.lastName ? user.lastName[0] : ''}</div>
          </div>
          <form id="profileForm">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">Nombre</label>
                <input type="text" id="firstName" class="form-control" value="${Helpers.escapeHtml(user.firstName || '')}" required>
              </div>
              <div class="form-group">
                <label for="lastName">Apellido</label>
                <input type="text" id="lastName" class="form-control" value="${Helpers.escapeHtml(user.lastName || '')}" required>
              </div>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" class="form-control" value="${Helpers.escapeHtml(user.email || '')}" required>
            </div>
            <div class="form-group">
              <label for="shippingAddress">Dirección de Envío</label>
              <input type="text" id="shippingAddress" class="form-control" value="${Helpers.escapeHtml(user.shippingAddress || '')}" placeholder="Tu dirección de envío">
            </div>
            <hr>
            <h3 class="section-title">Cambiar Contraseña</h3>
            <p class="text-muted small">Deja estos campos vacíos si no deseas cambiar tu contraseña.</p>
            <div class="form-group">
              <label for="currentPassword">Contraseña Actual</label>
              <input type="password" id="currentPassword" class="form-control" placeholder="Tu contraseña actual">
            </div>
            <div class="form-group">
              <label for="newPassword">Nueva Contraseña</label>
              <input type="password" id="newPassword" class="form-control" placeholder="Nueva contraseña">
            </div>
            <div class="form-group">
              <label for="confirmPassword">Confirmar Nueva Contraseña</label>
              <input type="password" id="confirmPassword" class="form-control" placeholder="Confirmar nueva contraseña">
            </div>
            <div class="form-group">
              <label>Rol</label>
              <input type="text" class="form-control" value="${Helpers.translateRole(user.role ? user.role.name : 'N/A')}" readonly disabled>
            </div>
            <button type="submit" class="btn btn-primary" id="saveProfileBtn">
              <i class="fas fa-save"></i> Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    `;
  },

  afterRender: async () => {
    const form = document.getElementById('profileForm');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const user = Storage.getAuth().user;
      const firstName = document.getElementById('firstName').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      const email = document.getElementById('email').value.trim();
      const shippingAddress = document.getElementById('shippingAddress').value.trim();
      const currentPassword = document.getElementById('currentPassword').value;
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      if (!firstName || !lastName || !email) {
        Toast.show('Nombre, apellido y email son obligatorios', 'error');
        return;
      }

      if (newPassword || confirmPassword || currentPassword) {
        if (!currentPassword) {
          Toast.show('Debes ingresar tu contraseña actual para cambiarla', 'error');
          return;
        }
        if (newPassword !== confirmPassword) {
          Toast.show('Las contraseñas nuevas no coinciden', 'error');
          return;
        }
        if (newPassword.length < 6) {
          Toast.show('La nueva contraseña debe tener al menos 6 caracteres', 'error');
          return;
        }
        if (newPassword === currentPassword) {
          Toast.show('La nueva contraseña debe ser diferente a la actual', 'error');
          return;
        }
      }

      try {
        const saveBtn = document.getElementById('saveProfileBtn');
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

        const updateData = {
          firstName,
          lastName,
          email,
          shippingAddress
        };

        if (newPassword && currentPassword) {
          updateData.currentPassword = currentPassword;
          updateData.newPassword = newPassword;
        }

        await UserService.updateProfile(user.id, updateData);

        const auth = Storage.getAuth();
        auth.user.firstName = firstName;
        auth.user.lastName = lastName;
        auth.user.email = email;
        auth.user.shippingAddress = shippingAddress;
        Storage.saveAuth(auth.token, auth.user);

        Toast.show('Perfil actualizado correctamente', 'success');

        if (typeof Navbar !== 'undefined') {
          Navbar.render('sidebar');
        }

      } catch (error) {
        console.error('Error updating profile:', error);
        Toast.show(error.message || 'Error al actualizar el perfil', 'error');
      } finally {
        const saveBtn = document.getElementById('saveProfileBtn');
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
      }
    });
  }
};
